let ipAddr ="localhost";

// fetch("https://api.ipify.org?format=json")
//   .then((response) => response.json())
//   .then((data) => {
//     ipAddr = data.ip;
//     console.log(data.ip);
//   })
//   .catch((error) => {
//     console.log("Error:", error);
//   });

// window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
// var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};
// pc.createDataChannel('');
// pc.createOffer(pc.setLocalDescription.bind(pc), noop);
// pc.onicecandidate = function(ice)
// {
//  if (ice && ice.candidate && ice.candidate.candidate)
//  {
//   var myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
//   ipAddr = myIP;
//   console.log('my IP: ', myIP);
//   pc.onicecandidate = noop;
//  }
// };

const config = {
  apiUrl: "http://" + ipAddr + "/backend/",

};

export default config;
