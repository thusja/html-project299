document.addEventListener("DOMContentLoaded", () => {
  const flipButton = document.getElementById("flip_random_btn");
  const resetButton = document.getElementById("reset_btn");
  const cards = document.querySelectorAll(".card");
  let lastFlippedCard = null; // 이전에 뒤집힌 카드 저장 변수

  flipButton.addEventListener("click", () => {
    if (cards.length === 1) return; // 카드가 없으면 실행하지 않음

    let randomIndex;
    let randomCard;

    // 마지막 카드를 제외한 카드들만 필터링
    const filteredCards = Array.from(cards).slice(0, -1);

    // 새로운 카드가 기존 카드와 다를 때까지 반복
    do {
      randomIndex = Math.floor(Math.random() * filteredCards.length);
      randomCard = filteredCards[randomIndex];
    } while (randomCard === lastFlippedCard); // 같은 카드가 나오면 다시 선택

    // 기존에 뒤집힌 카드가 있으면 원래 상태로 복귀
    if (lastFlippedCard) {
      lastFlippedCard.classList.remove("flipped");
    }

    // 새로운 카드를 뒤집기 (기존 hover 방식과 동일)
    randomCard.classList.add("flipped");

    // 현재 뒤집힌 카드를 저장
    lastFlippedCard = randomCard;
  });

  // 초기화 버튼 기능
  resetButton.addEventListener("click", () => {
    lastFlippedCard = null;

    // 모든 카드 원래 상태로 되돌리기
    cards.forEach((card) => {
      card.classList.remove("flipped");
    });
  });
});
