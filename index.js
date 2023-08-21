let currLiftPositionArr = [];
let liftsInfo = [];
let btn = document.getElementById("generate");
btn.addEventListener("click", generateLayout);

function generateLayout() {
  const floorInput = document.querySelector("#floor-count");
  const liftInput = document.querySelector("#lift-count");
  let floorCount = Number(floorInput.value);
  let liftCount = Number(liftInput.value);
  generateFloorsAndLifts(floorCount, liftCount);
}

function generateFloorsAndLifts(m, n) {
  // console.log({ m, n });
  document.getElementById("layout").innerHTML = "";

  for (let i = 0; i < m; i++) {
    let floorNo = `Floor-${m - i - 1}`;
    let currFloor = document.createElement("div");
    currFloor.classList.add("floor");
    currFloor.setAttribute("id", floorNo);
    currFloor.innerHTML = `
            <div>
              <div class="buttons">
                <button class='btn' onclick="callLift(${
                  m - i - 1
                }, 'up')">Up</button>
                <button class='btn' onclick="callLift(${
                  m - i - 1
                }, 'down')">Down</button>
              </div>
            <p>${floorNo}</p>
            </div> 
        `;
    document.getElementById("layout").append(currFloor);
  }

  //lifts generation
  for (let i = 0; i < n; i++) {
    let liftNo = `Lift-${i}`;
    let lift = document.createElement("div");
    lift.classList.add("lift");
    lift.setAttribute("id", liftNo);

    lift.innerHTML = `
      <div class='door leftDoor' id="L${i}_left"></div>
      <div class='door rightDoor' id="L${i}_right"></div>
    `;

    lift.style.left = `${(i + 1) * 90}px`;
    lift.style.top = "0px";
    document.getElementById("Floor-0").appendChild(lift);
    currLiftPositionArr[i] = 0;

    const currentLiftInfo = {};
    currentLiftInfo.id = liftNo;
    currentLiftInfo.inMotion = false;
    liftsInfo.push(currentLiftInfo);
  }
}

function callLift(floor, direction) {
  // console.log({ floor, direction });
  let nearestLift = null;
  let minDistance = Number.MAX_SAFE_INTEGER;

  for (let i = 0; i < currLiftPositionArr.length; i++) {
    const distance = Math.abs(currLiftPositionArr[i] - floor);
    if (distance < minDistance) {
      minDistance = distance;
      nearestLift = i;
    }
  }
  // console.log(`nearestAvailableLift is ${nearestLift}`);
  if (nearestLift !== -1) {
    moveLift(nearestLift, floor);
  }
}

function moveLift(liftNo, targetLiftPosn) {
  const reqLift = document.getElementById(`Lift-${liftNo}`);
  let currLiftPosn = parseInt(currLiftPositionArr[liftNo]);
  let stepVector;
  var anim = setInterval(animate, 1000);

  function animate() {
    if (currLiftPosn != targetLiftPosn) {
      // console.log("inside if", currLiftPosn, targetLiftPosn);
      stepVector = parseInt(Math.sign(targetLiftPosn - currLiftPosn));
      currLiftPosn += stepVector;
      let intermediateFloor = `${currLiftPosn * -100}px`;
      reqLift.style.top = intermediateFloor;
    } else {
      currLiftPositionArr[liftNo] = targetLiftPosn;
      clearInterval(anim);
      animateLiftDoors(liftNo);
    }
  }
}

function animateLiftDoors(liftNo) {
  const reqLift = document.getElementById(`Lift-${liftNo}`);
  const targetLiftPosn = currLiftPositionArr[liftNo];

  reqLift.style.transition = "top 0.5s";
  reqLift.style.top = `${targetLiftPosn * -100}px`;

  reqLift.addEventListener("transitionend", () => {
    openLiftDoors(liftNo);
  });
}

function openLiftDoors(liftNo) {
  const leftGate = document.getElementById(`L${liftNo}_left`);
  const rightGate = document.getElementById(`L${liftNo}_right`);

  leftGate.classList.add("openDoor");
  rightGate.classList.add("openDoor");

  setTimeout(() => {
    leftGate.classList.remove("openDoor");
    rightGate.classList.remove("openDoor");
    closeLiftDoors(liftNo);
  }, 2500);
}

function closeLiftDoors(liftNo) {
  const leftGate = document.getElementById(`L${liftNo}_left`);
  const rightGate = document.getElementById(`L${liftNo}_right`);

  leftGate.classList.add("closeDoor");
  rightGate.classList.add("closeDoor");

  setTimeout(() => {
    leftGate.classList.remove("closeDoor");
    rightGate.classList.remove("closeDoor");
    liftsInfo[liftNo].inMotion = false;

    if (liftCallsQueue.length > 0) {
      const nextFloor = liftCallsQueue.shift();
      const nearestLift = findNearestFreeLift(nextFloor);
      if (nearestLift !== -1) {
        moveLift(nearestLift, nextFloor);
      }
    }
  }, 2500);
}

function fullfillLiftCallsQueue() {
  if (liftCallsQueue.length === 0) return;

  const targetFloor = liftCallsQueue[0];
  const nearestLift = findNearestFreeLift(targetFloor);

  if (nearestLift !== -1) {
    moveLift(nearestLift, targetFloor);
    liftCallsQueue.shift();
  }
}
