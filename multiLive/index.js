// SDK basic configuration
const config = {
  appID: 1719562607,
  serverURL: "wss://webliveroom" + 1719562607 + "-api.zegocloud.com/ws",
  tokenServerUrl: "https://easy-example-call.herokuapp.com",
  userID: "",
};
config.userID = getUserID(10);

let zg,
  role,
  remoteStreamList = [],
  flvPlayer,
  mixStreamList = [];

// Generate random userID
function getUserID(len) {
  let result = "";
  if (result) return result;
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

// dynamically load plugins
function loadScript(url, callback) {
  const script = document.createElement("script");
  script.type = "text/javascript";
  // Compatible with IE
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    // handle the case of other browsers
    script.onload = function () {
      callback();
    };
  }
  script.src = url;
  document.body.append(script);
}

// load plugin
loadScript("./ZegoExpressWebRTC-2.16.0.js", init);

// Render UI, bind click event
function init() {
  document.querySelector("#userID").innerHTML = config.userID;
  checkRequirements();
  document.querySelector(".user .jonAsHost").addEventListener("click", () => {
    role = "host";
    goLive();
  });
  document
    .querySelector(".user .jonAsAudience")
    .addEventListener("click", () => {
      role = "audience";
      goLive();
    });

  document.querySelectorAll(".publishHandler button").forEach((value) => {
    value.addEventListener("click", function () {
      if (value.classList.contains("off")) {
        value.classList.remove("off");
      } else {
        value.classList.add("off");
      }

      if (value.classList.contains("mic")) {
        enableMic(value.classList.contains("off"));
      } else if (value.classList.contains("camera")) {
        enableCamera(value.classList.contains("off"));
      } else {
        leaveRoom();
      }
    });
  });
}

// Compatibility check
// Microphone availability check
// camera availability check
async function checkRequirements() {
  zg = new ZegoExpressEngine(config.appID, config.serverURL);
  const result = await zg.checkSystemRequirements();
  !result.webRTC && alert("This browser does not support WebRTC");
  !result.camera && alert("This browser camera unavailable");
  !result.microphone && alert("This browser microphone unavailable");
}

// start the call
function goLive() {
  if (document.querySelector("#roomID").value) {
    document.querySelector(".user").style.display = "none";
    document.querySelector(".call").style.display = "block";
    initSDK();
    joinRoom();
  } else {
    setTimeout(function () {
      document.querySelector("#roomID").focus();
    }, 500);
  }
}

function showNotify(title, body, callback) {
  document.querySelector(".title").innerHTML = title;
  document.querySelector(".content").innerHTML = body;
  document.querySelector(".notify").style.display = "flex";
  document.querySelectorAll(".notify .handler button").forEach((el) => {
    el.onclick = () => {
      callback(el.classList.contains("accept"));
      document.querySelector(".notify").style.display = "none";
    };
  });
}
function initSDK() {
  // Callback for updates on the status of ther users in the room.
  zg.on("roomUserUpdate", (roomID, updateType, userList) => {
    console.warn(
      `roomUserUpdate: room ${roomID}, user ${
        updateType === "ADD" ? "added" : "left"
      } `,
      JSON.stringify(userList)
    );
    if (role !== "host") return;

    if (updateType === "ADD") {
      userList.forEach((user) => {
        {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.onclick = () => {
            zg.sendCustomCommand(roomID, "invite", [user.userID]);
          };
          a.innerHTML = "invite";
          li.innerHTML = user.userID;
          li.classList.add("user-" + user.userID);
          li.appendChild(a);
          document.querySelector(".userList").append(li);
        }
      });
    } else {
      userList.forEach((user) => {
        {
          const li = document.querySelector(".userList .user-" + user.userID);
          li && document.querySelector(".userList").removeChild(li);
        }
      });
    }
  });

  zg.on("IMRecvCustomCommand", async (roomID, fromUser, command) => {
    console.warn("IMRecvCustomCommand");
    role === "audience" &&
      showNotify(fromUser.userID, command + " you to live", async (result) => {
        if (result) {
          role = "cohost";
          // After calling the CreateStream method, you need to wait for the ZEGO server to return the local stream object before any further operation.
          const localStream = await zg.createStream();
          // Obtain the video tag of the local video.
          const localVideo = document.createElement("video");
          localVideo.id = "cohost-" + config.userID;
          localVideo.autoplay = true;
          localVideo.playsInline = true;
          localVideo.muted = true;
          // The local stream is a MediaStream object. You can render audio and video by assigning the local stream to the SrCObject property of video or audio.
          localVideo.srcObject = localStream;
          document.querySelector(".user2").prepend(localVideo);
          // localStream is the MediaStream object created by calling creatStream in the previous step.
          zg.startPublishingStream(localVideo.id, localStream);

          // 停止拉CDN改为拉RTC
          stopCDNStream();
          playRTCStream(remoteStreamList);
        }
      });
  });

  // Callback for updates on the status of the streams in the room.
  zg.on(
    "roomStreamUpdate",
    async (roomID, updateType, streamList, extendedData) => {
      if (updateType == "ADD") {
        remoteStreamList = [...remoteStreamList, ...streamList];
        if (role === "audience") {
          playCDNStream(roomID);
        } else {
          playRTCStream(streamList);
        }
      } else if (updateType == "DELETE") {
        remoteStreamList = remoteStreamList.filter(
          (stream) => !streamList.some((s) => s.streamID === stream.streamID)
        );

        if (role === "audience") {
          if (streamList.some((stream) => stream.streamID.startsWith("host"))) {
            leaveRoom();
          }
        } else if (role === "cohost") {
          if (streamList.some((stream) => stream.streamID.startsWith("host"))) {
            leaveRoom();
          } else {
            stopRTCStream(streamList);
          }
        } else {
          stopRTCStream(streamList);
        }
      }
      if (role === "host") {
        startMixStream(roomID, updateType, streamList);
      }
    }
  );
}

async function startMixStream(taskID, updateType, streamList) {
  try {
    let _mixStreamIDList = mixStreamList.map((s) => s.streamID);
    const hostList = [],
      cohostIDList = [];

    if (updateType === "ADD") {
      _mixStreamIDList = [
        ..._mixStreamIDList,
        ...streamList.map((s) => s.streamID),
      ];
    } else {
      _mixStreamIDList = _mixStreamIDList.filter(
        (id) => !streamList.some((s) => s.streamID === id)
      );
    }

    _mixStreamIDList.forEach((streamID) => {
      if (streamID.startsWith("host")) {
        hostList.push(streamID);
      } else {
        cohostIDList.push(streamID);
      }
    });

    const _mixStreamList = [];
    hostList.length > 0 &&
      _mixStreamList.push({
        streamID: hostList[0],
        contentType: "",
        layout: {
          top: 0,
          left: 0,
          bottom: 480,
          right: 640,
        },
      });
    cohostIDList.length > 0 &&
      cohostIDList.forEach((streamID, index) => {
        const line = Math.floor((index + 1) / 4);
        const col = index % 4;
        _mixStreamList.push({
          streamID,
          contentType: "",
          layout: {
            top: 480 + 120 * line,
            left: 160 * col,
            bottom: 480 + 120 * (line + 1),
            right: 160 * (col + 1),
          },
        });
      });

    if (
      _mixStreamList.length === 0 ||
      !document.querySelector(".user1 video")
    ) {
      return;
    }

    const res = await zg.startMixerTask({
      taskID,
      inputList: _mixStreamList,
      outputList: [
        {
          target: "rtmp://wsdemo.zego.im/zegodemo/" + taskID,
        },
      ],
      outputConfig: {
        outputBitrate: 1000,
        outputFPS: 15,
        outputWidth: 640,
        outputHeight: 480 + 120 * Math.ceil(cohostIDList.length / 4),
      },
    });

    if (res.errorCode == 0) {
      mixStreamList = _mixStreamList;
    }
  } catch (err) {
    console.error("mixStream err: ", err);
  }
}
function playRTCStream(streamList) {
  streamList.forEach(async (stream) => {
    // New stream added, start playing the stream.
    const remoteStream = await zg.startPlayingStream(stream.streamID);

    const remoteVideo = document.createElement("video");
    remoteVideo.id = stream.streamID;
    remoteVideo.autoplay = true;
    remoteVideo.playsInline = true;
    // The remoteVideo object is the <video> or <audio> element on your webpage.
    remoteVideo.srcObject = remoteStream;

    if (stream.streamID.startsWith("host")) {
      document.querySelector(".user1").prepend(remoteVideo);
      document.querySelector(".publishHandler .mic").style.display = "none";
      document.querySelector(".publishHandler .camera").style.display = "none";
    } else {
      document.querySelector(".user2").appendChild(remoteVideo);
    }
  });
}

function stopRTCStream(streamList) {
  // Stream deleted, stop playing the stream.
  streamList.forEach(async (stream) => {
    // New stream added, start playing the stream.
    await zg.stopPlayingStream(stream.streamID);
    const remoteVide0 = document.querySelector("#" + stream.streamID);
    if (!remoteVide0) return;
    if (stream.streamID.startsWith("host")) {
      document.querySelector(".user1").removeChild(remoteVide0);
    } else {
      document.querySelector(".user2").removeChild(remoteVide0);
    }
  });
}

function playCDNStream(roomID) {
  if (document.querySelector(".user1 video")) return;
  const videoElement = document.createElement("video");
  videoElement.id = roomID;
  videoElement.autoplay = true;
  videoElement.playsInline = true;
  document.querySelector(".user1").prepend(videoElement);
  document.querySelector(".publishHandler .mic").style.display = "none";
  document.querySelector(".publishHandler .camera").style.display = "none";

  loadScript("./flv.min.js", () => {
    if (flvjs.isSupported()) {
      const flvUrl = "https://hdl-wsdemo.zego.im/zegodemo/" + roomID + ".flv";
      //若支持flv.js
      flvPlayer = flvjs.createPlayer({
        type: "flv",
        isLive: true,
        url: flvUrl,
        hasAudio: true, //是否需要音频
        hasVideo: true, //是否需要视频
      });
      flvPlayer.on(flvjs.Events.LOADING_COMPLETE, function () {
        console.error("LOADING_COMPLETE");
        flvPlayer.play();
      });
      flvPlayer.attachMediaElement(videoElement);
      flvPlayer.load();
      videoElement.muted = false;
      videoElement.controls = true;
    } else {
      const m3u8Url =
        "https://hls.wsdemo.zego.im/zegodemo/" + roomID + "/playlist.m3u8";
      videoElement.src = m3u8Url;
    }
  });
}
function stopCDNStream() {
  const videoElement = document.querySelector(".user1 video");
  if (flvPlayer) {
    flvPlayer.pause();
    flvPlayer.unload();
    flvPlayer.detachMediaElement();
    flvPlayer.destroy();
    flvPlayer = null;
  }
  videoElement && document.querySelector(".user1").removeChild(videoElement);
}
// enter the room
async function joinRoom() {
  const tokenObj = await generateToken();
  const result = await zg.loginRoom(
    document.querySelector("#roomID").value,
    tokenObj.token,
    {
      userID: config.userID,
      userName: config.userID,
    },
    { userUpdate: true }
  );

  if (role === "host") {
    // After calling the CreateStream method, you need to wait for the ZEGO server to return the local stream object before any further operation.
    const localStream = await zg.createStream();
    // Obtain the video tag of the local video.
    const localVideo = document.createElement("video");
    localVideo.id = "host-" + config.userID;
    localVideo.autoplay = true;
    localVideo.playsInline = true;
    localVideo.muted = true;
    // The local stream is a MediaStream object. You can render audio and video by assigning the local stream to the SrCObject property of video or audio.
    localVideo.srcObject = localStream;
    document.querySelector(".user1").prepend(localVideo);

    zg.on("publisherStateUpdate", (result) => {
      if (result.streamID === localVideo.id && result.state === "PUBLISHING") {
        startMixStream(document.querySelector("#roomID").value, "ADD", [
          { streamID: result.streamID },
        ]);
      }
    });
    // localStream is the MediaStream object created by calling creatStream in the previous step.
    zg.startPublishingStream(localVideo.id, localStream);
  }
}

// 生成token
function generateToken() {
  // return {
  //   token: generateV4Token(config.userID, 7200),
  // };
  // Obtain the token interface provided by the App Server
  return fetch(
    `${config.tokenServerUrl}/access_token?uid=${config.userID}&expired_ts=7200`,
    {
      method: "GET",
    }
  ).then((res) => res.json());
}

// turn the camera on/off
function enableCamera(cameraEnable) {
  const result = zg.mutePublishStreamVideo(
    document.querySelector(".user1 video").srcObject,
    cameraEnable
  );
  result && (cameraEnable = !cameraEnable);
}
// switch microphone
function enableMic(micEnable) {
  result = zg.mutePublishStreamAudio(
    document.querySelector(".user1 video").srcObject,
    micEnable
  );
  result && (micEnable = !micEnable);
}

// leave the room
async function leaveRoom() {
  if (role === "host") {
    const localVideo = document.querySelector(".user1 video");
    //stop streaming
    zg.stopPublishingStream(localVideo.id);
    //destroy Local Stream
    zg.destroyStream(localVideo.srcObject);
    // Ecstasy Streaming Rendering
    document.querySelector(".user1").removeChild(localVideo);

    document.querySelectorAll(".user2 video").forEach((el) => {
      // stop pulling
      zg.stopPlayingStream(el.id);
      // Ecstasy Streaming Rendering
      document.querySelector(".user2").removeChild(el);
    });

    //Clear user list
    document.querySelectorAll(".userList li").forEach((el) => {
      document.querySelector(".userList").removeChild(el);
    });

    await zg.stopMixerTask(document.querySelector("#roomID").value);
    mixStreamList = [];
  } else if (role === "cohost") {
    const remoteVideo = document.querySelector(".user1 video");
    // stop pulling
    zg.stopPlayingStream(remoteVideo.id);
    // Ecstasy Streaming Rendering
    document.querySelector(".user1").removeChild(remoteVideo);

    document.querySelectorAll(".user2 video").forEach((el, index) => {
      if (index === 0) {
        //stop streaming
        zg.stopPublishingStream(el.id);
        //destroy Local Stream
        zg.destroyStream(el.srcObject);
      } else {
        // stop pulling
        zg.stopPlayingStream(el.id);
      }
      // Ecstasy Streaming Rendering
      document.querySelector(".user2").removeChild(el);
    });
  } else {
    stopCDNStream();
  }

  remoteStreamList = [];
  zg.off("roomUserUpdate");
  zg.off("IMRecvCustomCommand");
  zg.off("roomStreamUpdate");
  zg.off("publisherStateUpdate");
  // logout room
  zg.logoutRoom();

  setTimeout(function () {
    document.querySelector(".user").style.display = "block";
    document.querySelector(".call").style.display = "none";
  }, 1000);
}
