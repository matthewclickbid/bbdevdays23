import $ from "jquery";
import { gsap, Power0, Power1 } from "gsap";
import "./style.css";

const CB_API = import.meta.env.VITE_CLICKBID_API;
const CB_UID = import.meta.env.VITE_CLICKBID_UID;
const RE_API = import.meta.env.VITE_RE_API_TOKEN;
const RE_SUB_KEY = import.meta.env.VITE_RE_SUB_KEY;
const RE_TOKEN = import.meta.env.VITE_RE_TOKEN;
const RE_CLIENT_ID = import.meta.env.VITE_RE_CLIENT_ID;
const RE_CLIENT_SECRET = import.meta.env.VITE_RE_CLIENT_SECRET;
const CB_ROOT_API = import.meta.env.VITE_CB_ROOT_API;
const RE_ROOT_REDIRECT = import.meta.env.VITE_RE_ROOT_REDIRECT;
const RE_ROOT_API = import.meta.env.VITE_RE_ROOT_API;
const count = 50;
const blurCount = 10;
let cbTs = 1;
let reTs = "2023-05-15T17:59:31.1600745-04:00";
let namesIndex = 0;
let names = [];
let total = 0;
let stage;
let USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

async function fetchClickBid() {
  let response = await fetch(CB_ROOT_API + "/bids/" + cbTs, {
    method: "GET",
    headers: {
      Authorization: "Basic " + window.btoa(CB_UID + ":" + CB_API),
    },
  });
  if (response.status >= 400) {
    console.log("error", response.status);
  } else {
    let data = await response.json();
    if (data.resultCode != "001") {
      console.log("error", data.resultCode);
    } else {
      cbTs = data.time_stamp;
      console.log(data);
      let i = 1;
      while (i < data.count) {
        randomHeart(data.bids[i].bid_amount);
        addName(data.bids[i].first_name + " " + data.bids[i].last_name);
        updateTotal(data.bids[i].bid_amount);
        await delay(3000);
        i++;
      }
      setTimeout(() => {
        fetchClickBid();
      }, 4000);
    }
  }
}

async function fetchREData() {
  let response = await fetch(
    RE_ROOT_API + "/gift/v1/gifts?date_added=" + reTs,
    {
      method: "GET",
      headers: {
        "bb-api-subscription-key": RE_SUB_KEY,
        Authorization: "Bearer " + RE_TOKEN,
      },
    }
  );
  if (response.status >= 400) {
    console.log("error", response.status, response);
    getREToken();
  } else {
    let data = await response.json();
    console.log(data);
    if (data.statusCode >= 400) {
      console.log("error", data.statusCode);
    } else {
      var date = new Date();
      reTs = date.toISOString();
      let i = 0;
      while (i < data.count) {
        randomHeart(data.value[i].amount.value);
        updateTotal(data.value[i].amount.value);
        await delay(3000);
        i++;
      }
      setTimeout(() => {
        fetchREData();
      }, 4000);
    }
  }
}

async function getREToken() {
  let formData = new FormData();
  formData.append("refresh_token", RE_API);
  formData.append("grant_type", "refresh_token");
  formData.append("redirect_uri", "http://localhost/black-baud-auth");
  let response = await fetch(RE_ROOT_REDIRECT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencode",
      Authorization:
        "Basic " + window.btoa(`${RE_CLIENT_ID}:${RE_CLIENT_SECRET}`),
    },
    form_params: formData,
  });
  console.log(response);
}

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function startBlur() {
  stage = document.querySelector(".stage");
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      makeLight(i);
    }, 50 * i);
  }
}

function makeLight(i) {
  let span = document.createElement("span");
  if (i < blurCount) {
    span.classList.add("blur");
  }
  stage.appendChild(span);

  gsap.set(span, {
    left: gsap.utils.random(0, stage.offsetWidth),
    top: gsap.utils.random(0, stage.offsetHeight),
    scale: gsap.utils.random(0.8, 1.2, 0.1),
    opacity: 0,
  });

  let tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      span.remove();
      makeLight(i);
    },
  });

  if (i < blurCount) {
    tl.to(span, {
      opacity: gsap.utils.random(0.1, 0.2),
      duration: 0.3,
    });
    tl.to(
      span,
      {
        x: gsap.utils.random(-100, 100),
        y: gsap.utils.random(-100, 100),
        duration: gsap.utils.random(5, 7, 0.2),
        ease: Power0.easeNone,
      },
      -0.3
    );
    tl.to(
      span,
      {
        opacity: 0,
        duration: 0.3,
      },
      ">-.3"
    );
  } else {
    tl.to(span, {
      opacity: gsap.utils.random(0.5, 0.8),
      duration: 0.3,
    });
    tl.to(
      span,
      {
        x: gsap.utils.random(-40, 40),
        y: gsap.utils.random(-40, 40),
        duration: gsap.utils.random(5, 7, 0.2),
        ease: Power0.easeNone,
      },
      -0.3
    );
    tl.to(
      span,
      {
        opacity: 0,
        duration: 0.3,
      },
      ">-.3"
    );
  }
  tl.play();
}

function randomHeart(amount) {
  amount = parseInt(amount);
  let span = document.createElement("span");
  const notices = document.querySelector(".notices");
  span.classList.add("heart");
  span.innerHTML = `
      <span class="heartAmount">${USDollar.format(amount)}</span>
      <img src="../images/heart.svg" width="100" height="100" class="filter-green"/>
  `;

  notices.appendChild(span);

  var startx = Math.random() * window.innerWidth;
  var endx = gsap.utils.random(-200, 200);
  console.log(startx, endx);
  gsap.set(span, {
    left: startx,
    bottom: -100,
    scale: gsap.utils.random(0.8, 1.2, 0.1),
    opacity: 0,
  });

  let tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      span.remove();
    },
  });

  tl.to(span, {
    opacity: 1,
    duration: 0.3,
  });

  tl.to(
    span,
    {
      x: endx,
      y: -window.innerHeight,
      duration: gsap.utils.random(6, 8, 0.2),
      ease: Power0.easeNone,
    },
    -0.3
  );

  tl.to(
    span,
    {
      opacity: 0,
      duration: 0.3,
    },
    ">-.3"
  );

  tl.play();
}

function addName(name) {
  names.splice(namesIndex, 0, name);
  console.log(names);
}

function rotateNames() {
  if (names.length > 0) {
    let elem = document.querySelector(".names");
    elem.innerHTML = elem.innerHTML + "<br>" + names[namesIndex];
    //elem.scrollTop = elem.scrollHeight
    $(".names").animate({ scrollTop: $(".names")[0].scrollHeight }, 2000);
    if (namesIndex == names.length - 1) {
      namesIndex = 0;
    } else {
      namesIndex++;
    }
  }
}

function floatAnimation(div) {
  const tlCan = new gsap.timeline({ repeat: -1 });
  const ran1 = Math.random() * 20;

  tlCan
    .to(div, 3, { y: "-=3", x: "+=3", rotation: "-=1", ease: Power1.easeInOut })
    .to(div, 2, { y: "+=4", x: "-=4", rotation: "-=1", ease: Power1.easeInOut })
    .to(div, 3, { y: "-=20", rotation: "+=1", ease: Power1.easeInOut })
    .to(div, 3, { y: "+=20", rotation: "+=1", ease: Power1.easeInOut })
    .to(div, 3, { y: "-=50", ease: Power1.easeInOut })
    .to(div, 3, { y: "+=50", ease: Power1.easeInOut })
    .to(div, 3, { y: "-=30", ease: Power1.easeInOut })
    .to(div, 3, { y: "+=30", ease: Power1.easeInOut })
    .to(div, 2, { y: "-=30", ease: Power1.easeInOut })
    .to(div, 2, { y: "+=30", ease: Power1.easeInOut });
}

function bouncy(div) {
  var tl = new gsap.timeline({ repeat: -1, repeatDelay: 2 })
    .to(div, 0.7, { rotation: 30 })
    .to(div, 7, { rotation: 0, ease: Elastic.easeOut.config(0.9, 0.1) });
  setTimeout(bouncy, 12000, div);
}

function updateTotal(amount) {
  total += parseInt(amount, 0);
  let elem = document.querySelector(".total");
  elem.innerHTML = `Raised so far!<br><b>${USDollar.format(total)}`;
}

window.onload = () => {
  startBlur();
  fetchClickBid();
  fetchREData();
  setInterval(rotateNames, 4000);
  floatAnimation(".recent_donors");
  floatAnimation(".qr");
  floatAnimation(".total");
};
