const form = document.getElementsByTagName("form")[0];
const inputTextarea = document.getElementsByTagName("textarea")[0];
const hanVietTextarea = document.getElementsByTagName("textarea")[1];
const loadingGIF = document.getElementById("loading");
let arrayM = [];

form.onsubmit = (e) => {
  e.preventDefault();
  loadingGIF.style.display = "inline";
  let tiengNhatContent = inputTextarea.value.trim();
  let tiengTrung = "";
  fetch(
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=" +
      tiengNhatContent
  )
    .then((res) => res.text())
    .then((raw) => {
      const parser = JSON.parse(raw);
      tiengTrung = parser[0][0][0];
    })
    .then(() => {
      let tiengTrungCharacters = tiengTrung.split("");
      let tiengHanViet = [];
      const numChar = tiengTrungCharacters.length;
      const p1 = Promise.resolve();
      p1.then(() => {
        for (let i = 0, p = Promise.resolve(); i < numChar; i++) {
          const char = tiengTrungCharacters[i];
          const proxyURL = 'https://cors-anywhere-dict.vercel.app/';
          // local test
          // const proxyURL = 'https://localhost:443/';
          const tuDienURL =
            "https://vtudien.com/trung-viet/dictionary/nghia-cua-tu-";
          p.then(() => {
            fetch(proxyURL + tuDienURL + char)
              .then((res) => res.text())
              .then((hanVietRaw) => {
                const hanVietHTML = new DOMParser().parseFromString(
                  hanVietRaw,
                  "text/html"
                );
                const elements = hanVietHTML.getElementsByTagName("td");
                let word = "";
                for (const a of elements) {
                  const textContent = a.textContent;
                  if (textContent.includes("Hán Việt")) {
                    word = textContent
                      .split(":")[1]
                      .split(",")[0]
                      .trim()
                      .toUpperCase();
                    break;
                  }
                }
                tiengHanViet[i] = word;
              });
          });
        }
      }).then(() => {
        var timeout = setInterval(function () {
          if (tiengHanViet.length >= numChar) {
            let res = tiengHanViet.join(" ");
            console.log(res);
            console.log(res.split(" ").length, numChar);
            hanVietTextarea.value = res;
            loadingGIF.style.display = "none";
            clearInterval(timeout);
          }
        }, 500);
      });
    });
};
