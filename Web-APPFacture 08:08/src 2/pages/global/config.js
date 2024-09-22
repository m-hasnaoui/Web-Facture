let ipAddr ="localhost";
// let ipAddr = "api.imlasoft.ma";
// let ipAddr = "imlasoftservices.website";
// "https://api.imlasoft.ma/api/selection.php";
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
  // apiUrl: 'http://192.168.11.113/api/',
  // socketUrl: 'ws://192.168.11.113:8080',
};

export default config;
