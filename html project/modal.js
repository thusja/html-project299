document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");
  const modal = document.getElementById("reviewModal");
  const closeModal = document.querySelector(".close");
  const cancelReview = document.getElementById("cancelReview");
  const submitReview = document.getElementById("submitReview");
  const reviewInput = document.getElementById("review");
  const ratingInput = document.getElementById("rating");
  const reviewsContainer = document.getElementById("reviewsContainer");
  let selectedCard = null;

  // "지도로 보기" 버튼 선택 (a 태그로 되어 있으므로 정확히 타겟팅)
  const mapButtons = document.querySelectorAll(".card_back .btn");
  mapButtons.forEach(button => {
    button.addEventListener("click", (event) => {
      event.stopPropagation(); // 카드 클릭 이벤트로 전파되지 않도록 차단
    });
  });

  // 리뷰 삭제 버튼 생성 및 스타일 적용
  const deleteReviewButton = document.createElement("button");
  deleteReviewButton.textContent = "삭제";
  deleteReviewButton.id = "deleteReview";
  deleteReviewButton.style.backgroundColor = "#b02a37";
  deleteReviewButton.style.color = "white";
  deleteReviewButton.style.padding = "10px";
  deleteReviewButton.style.border = "none";
  deleteReviewButton.style.borderRadius = "5px";
  deleteReviewButton.style.cursor = "pointer";
  deleteReviewButton.style.display = "none"; // 기본적으로 숨김 처리

  // 모달 버튼 컨테이너에 삭제 버튼 추가
  const modalButtons = modal.querySelector(".modal-buttons");
  if (modalButtons) {
    modalButtons.appendChild(deleteReviewButton);
  }

  // 페이지 로드 후 모달 숨기기
  setTimeout(() => {
    modal.style.display = "none";
  }, 100);

  // 모달 창 열기 함수 (입력 필드 초기화 & 기존 리뷰 표시)
  function openModal(event) {
    // "지도로 보기" 버튼을 클릭한 경우 모달이 열리지 않도록 차단
    if (event.target.closest(".card_back .btn")) return;

    selectedCard = event.currentTarget;
    reviewInput.value = "";
    ratingInput.selectedIndex = 0;

    modal.style.display = "flex";
    modal.style.visibility = "visible";
    modal.style.opacity = "1";

    // 기존 리뷰 불러와서 표시
    const cardId = selectedCard.dataset.id;
    const savedReviews = JSON.parse(localStorage.getItem(`reviews_${cardId}`)) || [];

    reviewsContainer.innerHTML = savedReviews.length
      ? savedReviews.map(review => `<p>⭐ ${review.rating}점: ${review.text}</p>`).join("")
      : "<p>리뷰가 없습니다.</p>";

    // 해당 카드에 리뷰가 없으면 삭제 버튼 숨기기
    deleteReviewButton.style.display = savedReviews.length ? "block" : "none";
  }

  // 모든 카드에 클릭 이벤트 추가
  cards.forEach((card) => {
    card.addEventListener("click", openModal);
  });

  // 닫기 및 취소 버튼 클릭 시 모달 닫기
  function closeModalHandler() {
    modal.style.opacity = "0";
    setTimeout(() => {
      modal.style.display = "none";
      modal.style.visibility = "hidden";
    }, 300);
  }

  closeModal.addEventListener("click", closeModalHandler);
  cancelReview.addEventListener("click", closeModalHandler);

  // 리뷰 제출 후 저장
  submitReview.addEventListener("click", () => {
    const rating = ratingInput.value;
    const reviewText = reviewInput.value.trim();

    if (!reviewText) {
      alert("리뷰를 입력해주세요!");
      return;
    }

    if (selectedCard) {
      const cardId = selectedCard.dataset.id;
      const savedReviews = JSON.parse(localStorage.getItem(`reviews_${cardId}`)) || [];
      savedReviews.push({ rating, text: reviewText });
      localStorage.setItem(`reviews_${cardId}`, JSON.stringify(savedReviews));

      // 모달 창에서 바로 리뷰 표시
      reviewsContainer.innerHTML += `<p>⭐ ${rating}점: ${reviewText}</p>`;

      // 리뷰가 추가되었으므로 삭제 버튼 보이기
      deleteReviewButton.style.display = "block";
    }

    alert("리뷰가 제출되었습니다!");
    closeModalHandler();
  });

  // 특정 카드 리뷰 삭제 기능
  deleteReviewButton.addEventListener("click", () => {
    if (selectedCard) {
      const cardId = selectedCard.dataset.id;
      if (confirm("이 카드의 모든 리뷰를 삭제하시겠습니까?")) {
        localStorage.removeItem(`reviews_${cardId}`);
        reviewsContainer.innerHTML = "<p>리뷰가 없습니다.</p>";
        deleteReviewButton.style.display = "none"; // 리뷰 삭제 후 버튼 숨기기
        alert(`카드 ${cardId}의 리뷰가 삭제되었습니다.`);
      }
    }
  });
});