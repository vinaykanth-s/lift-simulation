// build lift simulation using vanilla js

//generate onClick action
let btn = document.getElementById("generate");
btn.addEventListener("click", generateLayout);

function generateLayout() {
  let floorCount = Number(document.querySelector("#floor-count").value);
  let liftCount = Number(document.querySelector("#lift-count").value);
  // console.log({ floorCount, liftCount });
  generateFloors(floorCount, liftCount);
}

function generateFloors(m, n) {
  console.log({ m, n });
  document.getElementById("layout").innerHTML = "";
  for (let i = 0; i < m; i++) {
    let floorNo = `Floor-${m - i - 1}`;
    let currFloor = document.createElement("div");
    currFloor.classList.add("floor");
    currFloor.innerHTML = `<p>${floorNo}</p>`;
    document.getElementById("layout").append(currFloor);
  }

  let floors = document.getElementsByClassName("floor");
  let firstFloor = floors[floors.length - 1];
  // console.log({ firstFloor: floors[floors.length - 1] });
  // liftContainer.classList.add("lift-container");
  // document.getElementById("layout").append(liftContainer);
  console.log({ m, n });
  for (let i = 0; i < n; i++) {
    console.log({ i });
    let lift = document.createElement("div");
    lift.classList.add("lift");
    lift.innerHTML = `<p>Lift-${n - i}</p>`;
    firstFloor.appendChild(lift);
  }
}
