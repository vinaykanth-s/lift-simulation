let btn = document.getElementById("generate");
btn.addEventListener("click", generateLayout);
let currLiftPositionArr = [];

function generateLayout() {
  let floorCount = Number(document.querySelector("#floor-count").value);
  let liftCount = Number(document.querySelector("#lift-count").value);
  generateFloors(floorCount, liftCount);
}

function generateFloors(m, n) {
  console.log({ m, n });
  document.getElementById("layout").innerHTML = "";

  // let liftContainer = document.createElement("div");
  // liftContainer.classList.add("lift-container");

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

  // document.getElementById("layout").append(liftContainer);

  //lifts generation
  for (let i = 0; i < n; i++) {
    let liftNo = `Lift-${i}`;
    let lift = document.createElement("div");
    lift.classList.add("lift");
    lift.setAttribute("id", liftNo);

    lift.innerHTML = `<p>Lift-${n - i}</p>`;
    // let floorNo = `Floor-${m - i - 1}`;
    lift.style.left = `${(i + 1) * 90}px`;
    lift.style.top = "0px";
    document.getElementById("Floor-0").appendChild(lift);
    currLiftPositionArr[i] = 0;
  }
}

function callLift(floor, direction) {
  console.log({ floor, direction });
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
  //liftIndex, targetFloor
  console.log("moveLift called", targetLiftPosn);
  const reqLift = document.getElementById(`Lift-${liftNo}`);
  // console.log({ reqLift });
  let currLiftPosn = parseInt(currLiftPositionArr[liftNo]);
  // const targetLiftPosn = currLiftPositionArr[liftNo]
  var anim = setInterval(animate, 2000);

  function animate() {
    // console.log(`liftNo is ${liftNo}, currLiftPosn is ${currLiftPosn},targetLiftPosn is ${targetLiftPosn}`)
    console.log("outside if", currLiftPosn, targetLiftPosn);

    if (currLiftPosn != targetLiftPosn) {
      console.log("inside if", currLiftPosn, targetLiftPosn);
      stepVector = parseInt(Math.sign(targetLiftPosn - currLiftPosn));
      currLiftPosn += stepVector;
      let intermediateFloor = `${currLiftPosn * -100}px`;
      console.log({ reqLift });
      reqLift.style.top = intermediateFloor;
    } else {
      currLiftPositionArr[liftNo] = targetLiftPosn;
      clearInterval(anim);
    }
  }
}

console.log({ currLiftPositionArr });
