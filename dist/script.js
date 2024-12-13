// // Copyright 2023 The MediaPipe Authors.
// // Licensed under the Apache License, Version 2.0 (the "License");
// // you may not use this file except in compliance with the License.
// // You may obtain a copy of the License at
// //
// //      http://www.apache.org/licenses/LICENSE-2.0
// //
// // Unless required by applicable law or agreed to in writing, software
// // distributed under the License is distributed on an "AS IS" BASIS,
// // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// // See the License for the specific language governing permissions and
// // limitations under the License.
// import { PoseLandmarker, FilesetResolver, DrawingUtils } from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";
// const demosSection = document.getElementById("poseContainer");
// let poseLandmarker = undefined;
// let runningMode = "IMAGE";
// let enableWebcamButton;
// let webcamRunning = false;
// let poseName = "Crescent Pose (Anjaneyasana)";

// const videoHeight = "360px";
// const videoWidth = "480px";
// class Point {
//     constructor(x, y, z) {
//       this.x = x;
//       this.y = y;
//       this.z = z;
//     }
// }
// class SkeletonizedAngles {
//     constructor(rightElbowAngle, leftElbowAngle, rightShoulderAngle, leftShoulderAngle, rightHipAngle, leftHipAngle, rightKneeAngle, leftKneeAngle) {
//         this.rightElbowAngle = rightElbowAngle;
//         this.leftElbowAngle = leftElbowAngle;
//         this.rightShoulderAngle = rightShoulderAngle;
//         this.leftShoulderAngle = leftShoulderAngle;
//         this.rightHipAngle = rightHipAngle;
//         this.leftHipAngle = leftHipAngle;
//         this.rightKneeAngle = rightKneeAngle;
//         this.leftKneeAngle = leftKneeAngle;
//     }
// }
// let ideal = new SkeletonizedAngles(0,0,0,0,0,0,0,0);
// // Before we can use PoseLandmarker class we must wait for it to finish
// // loading. Machine Learning models can be large and take a moment to
// // get everything needed to run.
// const createPoseLandmarker = async () => {
//     const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
//     poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
//         baseOptions: {
//             modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
//             delegate: "GPU"
//         },
//         runningMode: runningMode,
//         numPoses: 2
//     });
//     demosSection.classList.remove("invisible");
// };
// createPoseLandmarker();
// /********************************************************************
// // Demo 1: Grab a bunch of images from the page and detection them
// // upon click.
// ********************************************************************/
// // In this demo, we have put all our clickable images in divs with the
// // CSS class 'detectionOnClick'. Lets get all the elements that have
// // this class.
// const imageContainers = document.getElementsByClassName("detectOnClick");
// // Now let's go through all of these and add a click event listener.
// for (let i = 0; i < imageContainers.length; i++) {
//     // Add event listener to the child element whichis the img element.
//     imageContainers[i].children[0].addEventListener("click", handleClick);
// }
// // When an image is clicked, let's detect it and display results!
// // still image
// async function handleClick(event) {
//     if (!poseLandmarker) {
//         console.log("Wait for poseLandmarker to load before clicking!");
//         return;
//     }
//     console.log("checking click")
//     if (runningMode === "VIDEO") {
//         runningMode = "IMAGE";
//         await poseLandmarker.setOptions({ runningMode: "IMAGE" });
//     }
//     // Remove all landmarks drawed before
//     const allCanvas = event.target.parentNode.getElementsByClassName("canvas");
//     for (var i = allCanvas.length - 1; i >= 0; i--) {
//         const n = allCanvas[i];
//         n.parentNode.removeChild(n);
//     }
//     // We can call poseLandmarker.detect as many times as we like with
//     // different image data each time. The result is returned in a callback.

//     poseLandmarker.detect(event.target, (result) => {
//         const canvas = document.createElement("canvas");
//         console.log("getting image name");
//         if (event.target.tagName === 'IMG') {
//             poseName = decodeURIComponent(event.target.src.split('/').pop());
//             console.log(poseName);
//         }
//         canvas.setAttribute("class", "canvas");
//         canvas.setAttribute("width", event.target.naturalWidth + "px");
//         canvas.setAttribute("height", event.target.naturalHeight + "px");
//         canvas.style =
//             "left: 0px;" +
//                 "top: 0px;" +
//                 "width: " +
//                 event.target.width +
//                 "px;" +
//                 "height: " +
//                 event.target.height +
//                 "px;";
//         event.target.parentNode.appendChild(canvas);
//         const canvasCtx = canvas.getContext("2d");
//         const drawingUtils = new DrawingUtils(canvasCtx);
//         for (const landmark of result.landmarks) {
//             drawingUtils.drawLandmarks(landmark, {
//                 radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1)
//             });
//             drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
//             ideal = handlePoseResult(result)
//         }
//         console.log("at end")
//         return
//         // const firstLandmarkSet = result.landmarks[0]; // Access the first set of landmarks
//         // const firstLandmark = firstLandmarkSet[0]; // Access the first landmark from the first set
//         // const xCoordinate = firstLandmark.x; // Get the x-coordinate
//         // for (let i = 0; i < firstLandmarkSet.length; i++) { 
//         //     console.log(i, firstLandmarkSet[i].x, firstLandmarkSet[i].y, firstLandmarkSet[i].z);
            
//         // }
// //         const angles = handlePoseResult(result);

// //         Object.entries(angles).forEach(([key, value]) => {
// //             console.log(`${key}: ${value}`);
// // });
            
//     });
// }
// console.log("enabling webcam")
// /********************************************************************
// // Demo 2: Continuously grab image from webcam stream and detect it.
// ********************************************************************/
// const video = document.getElementById("webcam");
// const canvasElement = document.getElementById("output_canvas");
// const canvasCtx = canvasElement.getContext("2d");
// const drawingUtils = new DrawingUtils(canvasCtx);
// // Check if webcam access is supported.

// const hasGetUserMedia = () => { var _a; return !!((_a = navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.getUserMedia); };
// // If webcam supported, add event listener to button for when user
// // wants to activate it.

// if (hasGetUserMedia()) {
    
//     enableWebcamButton = document.getElementById("webcamButton");
//     enableWebcamButton.addEventListener("click", enableCam);
// }
// else {
//     console.warn("getUserMedia() is not supported by your browser");
// }
// // Enable the live webcam view and start detection.
// function enableCam(event) {
//     console.log("trying to enable camera")
//     if (!poseLandmarker) {
//         console.log("Wait! poseLandmaker not loaded yet.");
//         return;
//     }
   
//     if (webcamRunning === true) {
//         webcamRunning = false;
//         enableWebcamButton.innerText = "ENABLE PREDICTIONS";
//     }
//     else {
//         webcamRunning = true;
//         enableWebcamButton.innerText = "DISABLE PREDICTIONS";
//     }
//     // getUsermedia parameters.
//     const constraints = {
//         video: true
//     };
//     // Activate the webcam stream.
//     navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
//         video.srcObject = stream;
//         video.addEventListener("loadeddata", predictWebcam);
//     });
// }
// let lastVideoTime = -1; 
// //live stuff
// async function predictWebcam() {
//     canvasElement.style.height = videoHeight;
//     video.style.height = videoHeight;
//     canvasElement.style.width = videoWidth;
//     video.style.width = videoWidth;
//     // Now let's start detecting the stream.
//     if (runningMode === "IMAGE") {
//         runningMode = "VIDEO";
//         await poseLandmarker.setOptions({ runningMode: "VIDEO" });
//     }
//     let startTimeMs = performance.now();
//     if (lastVideoTime !== video.currentTime) {
//         lastVideoTime = video.currentTime;
//         poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
//             canvasCtx.save();
//             canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
//             for (const landmark of result.landmarks) {
//                 drawingUtils.drawLandmarks(landmark, {
//                     radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1)
//                 });
//                 drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
//             }
//             canvasCtx.restore();
//             if (result && result.landmarks && result.landmarks.length > 0) {
//                 // console.log(handlePoseResult(result));
//                 // console.log("ideal:")
//                 // console.log("in here");
//                 // let diff = calcAngleDiff(handlePoseResult(result), ideal);
                
//                 // console.log(diff.leftKneeAngle, diff.rightKneeAngle);
                
//                 // let feed = outputFeedback(handlePoseResult(result), ideal);
//                 // const showfeed = document.getElementById('feedback');
//                 // showfeed.textContent = feed;
//             }
            
            
//         });
//     }

//     function outputFeedback(curr, ideal) {
//         let diff = calcAngleDiff(curr, ideal);
//         let currfeedback = "";
//         // currfeedback += "\n" + diff.rightKneeAngle
//         if (poseName == "Tree Pose (Vrksana)") {
//             if (Math.abs(diff.leftKneeAngle) > 20) {
//                 currfeedback += "\n" + "straighten your left leg";
//             }
//             if (Math.abs(curr.rightKneeAngle) < 20) {
//                 currfeedback += "\n" + "bend your right leg";
//             }
//             else if (Math.abs(diff.rightKneeAngle) > 50) {
//                 currfeedback += "\n" + "bend your right leg more";
//             }
//             if (Math.abs(diff.rightElbowAngle) > 50 && Math.abs(diff.leftElbowAngle) > 50) {
//                 currfeedback += "\n" + "bring your hands together";
//             }
//             // currfeedback += "\n" + curr.rightKneeAngle;
//         }
//         if (poseName == "Crescent Lunge (Anjaneyasana).png") {
//             if (Math.abs(diff.leftKneeAngle) > 30) {
//                 currfeedback += "\n" + "Straighten your back leg.";
//             }
//             if (Math.abs(diff.rightKneeAngle) > 30) {
//                 currfeedback += "\n" + "Adjust your front knee to about a 90-degree angle.";
//             }
//             if (Math.abs(diff.rightShoulderAngle) > 30 || Math.abs(diff.leftShoulderAngle) > 30) {
//                 currfeedback += "\n" + "Raise your arms straight up.";
//             }
//         }
        
//         if (currfeedback == "") {
//             currfeedback += "Good Job!"
//         }
//         return currfeedback;
//     }



//     function calcAngleDiff(currAngles, idealAngles) {
//         const diff = new SkeletonizedAngles(
//             (currAngles.rightElbowAngle - idealAngles.rightElbowAngle),
//             (currAngles.leftElbowAngle - idealAngles.leftElbowAngle),
//             (currAngles.rightShoulderAngle - idealAngles.rightShoulderAngle),
//             (currAngles.leftShoulderAngle - idealAngles.leftShoulderAngle),
//             (currAngles.rightHipAngle - idealAngles.rightHipAngle),
//             (currAngles.leftHipAngle - idealAngles.leftHipAngle),
//             (currAngles.rightKneeAngle - idealAngles.rightKneeAngle),
//             (currAngles.leftKneeAngle - idealAngles.leftKneeAngle)
//         );
        
//         return diff;
//     }
//     // Call this function again to keep predicting when the browser is ready.
//     if (webcamRunning === true) {
//         window.requestAnimationFrame(predictWebcam);
//     }
    
// }

// function calculateAngle(firstPoint, secondPoint, thirdPoint) {
//     const vector1 = {
//       x: secondPoint.x - firstPoint.x,
//       y: secondPoint.y - firstPoint.y
//     };
//     const vector2 = {
//       x: thirdPoint.x - secondPoint.x,
//       y: thirdPoint.y - secondPoint.y
//     };
    
//     const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
//     const magnitude1 = Math.sqrt(vector1.x ** 2 + vector1.y ** 2);
//     const magnitude2 = Math.sqrt(vector2.x ** 2 + vector2.y ** 2);
  
//     const angle = Math.acos(dotProduct / (magnitude1 * magnitude2)) * (180 / Math.PI);
//     return angle;
// }


// //for specifci pose
// // let ideal = new SkeletonizedAngles(
// //     8.412490542296553,
// //     10.336260797805474,
// //     1.0025938167305646,
// //     0.17805348784505573,
// //     80.80187679316087,
// //     47.404754363489396,
// //     84.4554577710374,
// //     12.170508985195385
// // ); 
//  // returns angles of everything
// function handlePoseResult(results) {
//     let curr = new SkeletonizedAngles(0,0,0,0,0,0,0,0);
//     if (results.landmarks && results.landmarks.length > 0) {
//       // Extract necessary landmarks
//         const rightShoulder = new Point(results.landmarks[0][12].x, results.landmarks[0][12].y, results.landmarks[0][12].z);
//         const rightElbow = new Point(results.landmarks[0][14].x, results.landmarks[0][14].y, results.landmarks[0][14].z);
//         const rightWrist = new Point(results.landmarks[0][16].x, results.landmarks[0][16].y, results.landmarks[0][16].z);
//         const rightHip = new Point(results.landmarks[0][24].x, results.landmarks[0][24].y, results.landmarks[0][24].z);
//         const rightKnee = new Point(results.landmarks[0][26].x, results.landmarks[0][26].y, results.landmarks[0][26].z);
//         const rightAnkle = new Point(results.landmarks[0][28].x, results.landmarks[0][28].y, results.landmarks[0][28].z);

//         // Same for the left side
//         const leftShoulder = new Point(results.landmarks[0][11].x, results.landmarks[0][11].y, results.landmarks[0][11].z);
//         const leftElbow = new Point(results.landmarks[0][13].x, results.landmarks[0][13].y, results.landmarks[0][13].z);
//         const leftWrist = new Point(results.landmarks[0][15].x, results.landmarks[0][15].y, results.landmarks[0][15].z);
//         const leftHip = new Point(results.landmarks[0][23].x, results.landmarks[0][23].y, results.landmarks[0][23].z);
//         const leftKnee = new Point(results.landmarks[0][25].x, results.landmarks[0][25].y, results.landmarks[0][25].z);
//         const leftAnkle = new Point(results.landmarks[0][27].x, results.landmarks[0][27].y, results.landmarks[0][27].z);

//       // Calculate the angles
//       curr.rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
//       curr.leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
//       curr.rightShoulderAngle = calculateAngle(rightHip, rightShoulder, rightElbow);
//       curr.leftShoulderAngle = calculateAngle(leftHip, leftShoulder, leftElbow);
//       curr.rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
//       curr.leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
//       curr.rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
//       curr.leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
//       // Compare the ideal and current angles (You can adjust the thresholds)
//       if (Math.abs(ideal.rightElbowAngle - curr.rightElbowAngle) > 20) {
//         // console.log("Bad right elbow position");
//       }
//       else {
//         // console.log("GOOD");
//       }
      
//       // Repeat this for all other angles
//     }
//     // console.log("ch ecking")
//     return curr;
//   }

// //   const pose = new Pose({
// //     locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
// //   });
  
// //   pose.setOptions({
// //     modelComplexity: 1,s
// //     smoothLandmarks: true,
// //     minDetectionConfidence: 0.5,
// //     minTrackingConfidence: 0.5
// //   });
  
// //   // Callback for pose results
// //   pose.onResults(handlePoseResult);
  
// //   // Function to start the webcam and process the pose
// //   const videoElement = document.getElementById('input_video');
// //   const camera = new Camera(videoElement, {
// //     onFrame: async () => {
// //       await pose.send({ image: videoElement });
// //     },
// //     width: 640,
// //     height: 480
// //   });
// //   camera.start();


// Copyright 2023 The MediaPipe Authors.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { PoseLandmarker, FilesetResolver, DrawingUtils } from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";
const demosSection = document.getElementById("poseContainer");
let poseLandmarker = undefined;
let runningMode = "IMAGE";
let enableWebcamButton;
let webcamRunning = false;
let poseName = "Crescent Pose (Anjaneyasana)";
const videoHeight = "360px";
const videoWidth = "480px";
// Before we can use PoseLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
class Point {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
}
class SkeletonizedAngles {
    constructor(rightElbowAngle, leftElbowAngle, rightShoulderAngle, leftShoulderAngle, rightHipAngle, leftHipAngle, rightKneeAngle, leftKneeAngle) {
        this.rightElbowAngle = rightElbowAngle;
        this.leftElbowAngle = leftElbowAngle;
        this.rightShoulderAngle = rightShoulderAngle;
        this.leftShoulderAngle = leftShoulderAngle;
        this.rightHipAngle = rightHipAngle;
        this.leftHipAngle = leftHipAngle;
        this.rightKneeAngle = rightKneeAngle;
        this.leftKneeAngle = leftKneeAngle;
    }
}
let ideal = new SkeletonizedAngles(0,0,0,0,0,0,0,0);
const createPoseLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
            delegate: "GPU"
        },
        runningMode: runningMode,
        numPoses: 2
    });
    // demosSection.classList.remove("invisible");
};
createPoseLandmarker();
/********************************************************************
// Demo 1: Grab a bunch of images from the page and detection them
// upon click.
********************************************************************/
// In this demo, we have put all our clickable images in divs with the
// CSS class 'detectionOnClick'. Lets get all the elements that have
// this class.
const imageContainers = document.getElementsByClassName("detectOnClick");
// Now let's go through all of these and add a click event listener.
if (imageContainers) {
    for (let i = 0; i < imageContainers.length; i++) {
        // Add event listener to the child element whichis the img element.
        imageContainers[i].children[0].addEventListener("click", handleClick);
    }
}
    
// When an image is clicked, let's detect it and display results!
// still image
async function handleClick(event) {
    console.log("checking click")
    if (!poseLandmarker) {
        console.log("Wait for poseLandmarker to load before clicking!");
        return;
    }
    if (runningMode === "VIDEO") {
        runningMode = "IMAGE";
        await poseLandmarker.setOptions({ runningMode: "IMAGE" });
    }
    // Remove all landmarks drawed before
    const allCanvas = event.target.parentNode.getElementsByClassName("canvas");
    for (var i = allCanvas.length - 1; i >= 0; i--) {
        const n = allCanvas[i];
        n.parentNode.removeChild(n);
    }
    // We can call poseLandmarker.detect as many times as we like with
    // different image data each time. The result is returned in a callback.

    poseLandmarker.detect(event.target, (result) => {
        const canvas = document.createElement("canvas");
        console.log("getting image name");
        if (event.target.tagName === 'IMG') {
            poseName = decodeURIComponent(event.target.src.split('/').pop());
            console.log(poseName);
        }
        canvas.setAttribute("class", "canvas");
        canvas.setAttribute("width", event.target.naturalWidth + "px");
        canvas.setAttribute("height", event.target.naturalHeight + "px");
        canvas.style =
            "left: 0px;" +
                "top: 0px;" +
                "width: " +
                event.target.width +
                "px;" +
                "height: " +
                event.target.height +
                "px;";
        event.target.parentNode.appendChild(canvas);
        const canvasCtx = canvas.getContext("2d");
        const drawingUtils = new DrawingUtils(canvasCtx);
        for (const landmark of result.landmarks) {
            drawingUtils.drawLandmarks(landmark, {
                radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1)
            });
            drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
            ideal = handlePoseResult(result)
        }   
    });
}
/********************************************************************
// Demo 2: Continuously grab image from webcam stream and detect it.
********************************************************************/
const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const drawingUtils = new DrawingUtils(canvasCtx);
// Check if webcam access is supported.
const hasGetUserMedia = () => { var _a; return !!((_a = navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.getUserMedia); };
// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
    enableWebcamButton = document.getElementById("webcamButton");
    enableWebcamButton.addEventListener("click", enableCam);
}
else {
    console.warn("getUserMedia() is not supported by your browser");
}
// Enable the live webcam view and start detection.
function enableCam(event) {
    if (!poseLandmarker) {
        console.log("Wait! poseLandmaker not loaded yet.");
        return;
    }
    if (webcamRunning === true) {
        webcamRunning = false;
        enableWebcamButton.innerText = "ENABLE PREDICTIONS";
    }
    else {
        webcamRunning = true;
        enableWebcamButton.innerText = "DISABLE PREDICTIONS";
    }
    // getUsermedia parameters.
    const constraints = {
        video: true
    };
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
    });
}
let lastVideoTime = -1; 
//live stuff
async function predictWebcam() {
    canvasElement.style.height = videoHeight;
    video.style.height = videoHeight;
    canvasElement.style.width = videoWidth;
    video.style.width = videoWidth;
    // Now let's start detecting the stream.
    if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await poseLandmarker.setOptions({ runningMode: "VIDEO" });
    }
    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            for (const landmark of result.landmarks) {
                drawingUtils.drawLandmarks(landmark, {
                    radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1)
                });
                drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
            }
            canvasCtx.restore();
            if (result && result.landmarks && result.landmarks.length > 0) {
                // console.log(handlePoseResult(result));
                // console.log("ideal:")
                // console.log("in here");
                // let diff = calcAngleDiff(handlePoseResult(result), ideal);
                
                // console.log(diff.leftKneeAngle, diff.rightKneeAngle);
                
                let feed = outputFeedback(handlePoseResult(result), ideal);
                const showfeed = document.getElementById('feedback');
                showfeed.innerHTML = feed;
            }
            
            
        });
    }

    function outputFeedback(curr, ideal) {
        let diff = calcAngleDiff(curr, ideal);
        let currfeedback = "";
        // currfeedback += "\n" + diff.rightKneeAngle
        if (poseName == "Tree Pose (Vrksasana).png") {
            if (Math.abs(diff.leftKneeAngle) > 20) {
                currfeedback += "<br>Straighten your left leg.";
            }
            if (Math.abs(curr.rightKneeAngle) < 20) {
                currfeedback += "<br>Bend your right leg.";
            }
            else if (Math.abs(diff.rightKneeAngle) > 50) {
                currfeedback += "<br>Bend your right leg more.";
            }
            if (Math.abs(diff.rightElbowAngle) > 50 && Math.abs(diff.leftElbowAngle) > 50) {
                currfeedback += "<br>Bring your hands together.";
            }
            // currfeedback += "\n" + curr.rightKneeAngle;
        }
        if (poseName == "Crescent Lunge Pose (Alanasana).png") {
            if (Math.abs(diff.leftKneeAngle) > 30) {
                currfeedback += "<br>Straighten your back leg.";
            }
            if (Math.abs(diff.rightKneeAngle) > 30) {
                currfeedback += "<br>Adjust your front knee to about a 90-degree angle.";
            }
            if (Math.abs(diff.rightShoulderAngle) > 30 || Math.abs(diff.leftShoulderAngle) > 30) {
                currfeedback += "<br>Raise your arms straight up.";
            }
        }
        if (poseName == "Warrior II Pose (Virabhadrasana II).png") {
            if (Math.abs(diff.leftKneeAngle) > 15) {
                currfeedback += "<br>Bend your front knee to a 90-degree angle.";
            }
            
            // Check if the back leg's knee is straight (almost 180 degrees).
            if (Math.abs(diff.rightKneeAngle) > 10) {
                currfeedback += "<br>Straighten your back leg.";
            }
            
            // Ensure the front arm (usually extended forward) is parallel to the floor (180 degrees at shoulder).
            if (Math.abs(diff.leftShoulderAngle) > 30) {
                currfeedback += "<br>Extend your front arm parallel to the ground.";
            }
        
            // Ensure the back arm (usually extended backward) is also parallel to the floor.
            if (Math.abs(diff.rightShoulderAngle) > 20) {
                currfeedback += "<br>Extend your back arm parallel to the ground.";
            }
        
            // Check if the hips are aligned to the side (hip should ideally be 90 degrees).
            // if (Math.abs(diff.leftHipAngle) > 20) {
            //     currfeedback += "<br>Open your hips more to the side.";
            // }
        
            // Check for alignment in the torso (upright posture). If shoulder angles suggest leaning, provide feedback.
        }
        
        if (currfeedback == "") {
            currfeedback += "Good Job!"
        }
        return currfeedback;
    }



    function calcAngleDiff(currAngles, idealAngles) {
        const diff = new SkeletonizedAngles(
            (currAngles.rightElbowAngle - idealAngles.rightElbowAngle),
            (currAngles.leftElbowAngle - idealAngles.leftElbowAngle),
            (currAngles.rightShoulderAngle - idealAngles.rightShoulderAngle),
            (currAngles.leftShoulderAngle - idealAngles.leftShoulderAngle),
            (currAngles.rightHipAngle - idealAngles.rightHipAngle),
            (currAngles.leftHipAngle - idealAngles.leftHipAngle),
            (currAngles.rightKneeAngle - idealAngles.rightKneeAngle),
            (currAngles.leftKneeAngle - idealAngles.leftKneeAngle)
        );
        
        return diff;
    }
    // Call this function again to keep predicting when the browser is ready.
    if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
    }
    
}

function calculateAngle(firstPoint, secondPoint, thirdPoint) {
    const vector1 = {
      x: secondPoint.x - firstPoint.x,
      y: secondPoint.y - firstPoint.y
    };
    const vector2 = {
      x: thirdPoint.x - secondPoint.x,
      y: thirdPoint.y - secondPoint.y
    };
    
    const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
    const magnitude1 = Math.sqrt(vector1.x ** 2 + vector1.y ** 2);
    const magnitude2 = Math.sqrt(vector2.x ** 2 + vector2.y ** 2);
  
    const angle = Math.acos(dotProduct / (magnitude1 * magnitude2)) * (180 / Math.PI);
    return angle;
}

//for specifci pose
// let ideal = new SkeletonizedAngles(
//     8.412490542296553,
//     10.336260797805474,
//     1.0025938167305646,
//     0.17805348784505573,
//     80.80187679316087,
//     47.404754363489396,
//     84.4554577710374,
//     12.170508985195385
// ); 
 // returns angles of everything
function handlePoseResult(results) {
    let curr = new SkeletonizedAngles(0,0,0,0,0,0,0,0);
    if (results.landmarks && results.landmarks.length > 0) {
      // Extract necessary landmarks
        const rightShoulder = new Point(results.landmarks[0][12].x, results.landmarks[0][12].y, results.landmarks[0][12].z);
        const rightElbow = new Point(results.landmarks[0][14].x, results.landmarks[0][14].y, results.landmarks[0][14].z);
        const rightWrist = new Point(results.landmarks[0][16].x, results.landmarks[0][16].y, results.landmarks[0][16].z);
        const rightHip = new Point(results.landmarks[0][24].x, results.landmarks[0][24].y, results.landmarks[0][24].z);
        const rightKnee = new Point(results.landmarks[0][26].x, results.landmarks[0][26].y, results.landmarks[0][26].z);
        const rightAnkle = new Point(results.landmarks[0][28].x, results.landmarks[0][28].y, results.landmarks[0][28].z);

        // Same for the left side
        const leftShoulder = new Point(results.landmarks[0][11].x, results.landmarks[0][11].y, results.landmarks[0][11].z);
        const leftElbow = new Point(results.landmarks[0][13].x, results.landmarks[0][13].y, results.landmarks[0][13].z);
        const leftWrist = new Point(results.landmarks[0][15].x, results.landmarks[0][15].y, results.landmarks[0][15].z);
        const leftHip = new Point(results.landmarks[0][23].x, results.landmarks[0][23].y, results.landmarks[0][23].z);
        const leftKnee = new Point(results.landmarks[0][25].x, results.landmarks[0][25].y, results.landmarks[0][25].z);
        const leftAnkle = new Point(results.landmarks[0][27].x, results.landmarks[0][27].y, results.landmarks[0][27].z);

      // Calculate the angles
      curr.rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
      curr.leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
      curr.rightShoulderAngle = calculateAngle(rightHip, rightShoulder, rightElbow);
      curr.leftShoulderAngle = calculateAngle(leftHip, leftShoulder, leftElbow);
      curr.rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
      curr.leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
      curr.rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
      curr.leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
      // Compare the ideal and current angles (You can adjust the thresholds)
      if (Math.abs(ideal.rightElbowAngle - curr.rightElbowAngle) > 20) {
        // console.log("Bad right elbow position");
      }
      else {
        // console.log("GOOD");
      }
      
      // Repeat this for all other angles
    }
    // console.log("ch ecking")
    return curr;
  }

//   const pose = new Pose({
//     locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
//   });
  
//   pose.setOptions({
//     modelComplexity: 1,s
//     smoothLandmarks: true,
//     minDetectionConfidence: 0.5,
//     minTrackingConfidence: 0.5
//   });
  
//   // Callback for pose results
//   pose.onResults(handlePoseResult);
  
//   // Function to start the webcam and process the pose
//   const videoElement = document.getElementById('input_video');
//   const camera = new Camera(videoElement, {
//     onFrame: async () => {
//       await pose.send({ image: videoElement });
//     },
//     width: 640,
//     height: 480
//   });
//   camera.start();