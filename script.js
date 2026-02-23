class FlashcardApp {
  constructor() {
    this.categories = ["one", "two", "three"];
    this.currentCategory = null;
    this.currentTopic = null;
    this.cards = [];
    this.currentIndex = 0;
    this.isFlipped = false;

    this.init();
  }

  async init() {
    await this.loadCategories(); // Wait for data first
    this.bindEvents();
  }

  bindEvents() {
    document.querySelectorAll(".category-btn").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.selectCategory(e.target.dataset.category),
      );
    });

    document.getElementById("topicSelect").addEventListener("change", (e) => {
      this.selectTopic(e.target.value);
    });

    document
      .getElementById("flipBtn")
      .addEventListener("click", () => this.flipCard());
    document
      .getElementById("prevBtn")
      .addEventListener("click", () => this.prevCard());
    document
      .getElementById("nextBtn")
      .addEventListener("click", () => this.nextCard());
    document
      .getElementById("flashcard")
      .addEventListener("click", () => this.flipCard());
  }

  async loadCategories() {
    try {
      const response = await fetch("categories.json");
      this.categoriesData = await response.json();
    } catch (e) {
      console.error("Failed to load categories:", e);
      this.categoriesData = {};
    }
  }

  selectCategory(category) {
    this.currentCategory = category;
    document
      .querySelectorAll(".category-btn")
      .forEach((btn) => btn.classList.remove("active"));
    document
      .querySelector(`[data-category="${category}"]`)
      .classList.add("active");

    const topics = this.categoriesData[category] || [];
    const dropdown = document.getElementById("dropdownContainer");
    const select = document.getElementById("topicSelect");

    select.innerHTML = '<option value="">Select topic...</option>';
    topics.forEach((topic) => {
      const option = document.createElement("option");
      option.value = topic;
      option.textContent = topic.charAt(0).toUpperCase() + topic.slice(1);
      select.appendChild(option);
    });

    dropdown.style.display = "block";
    document.getElementById("flashcardContainer").style.display = "none";
  }

  async selectTopic(topic) {
    // ADD THIS METHOD
    if (!topic) return;

    this.currentTopic = topic;
    try {
      await this.loadCards();
      this.showCard();
      document.getElementById("flashcardContainer").style.display = "block";
    } catch (e) {
      console.error("Failed to load cards:", e);
    }
  }

  async loadCards() {
    const response = await fetch(
      `${this.currentCategory}/${this.currentTopic}.json`,
    );
    this.cards = await response.json();
    this.currentIndex = 0;
    this.isFlipped = false;
  }

  showCard() {
    if (!this.cards.length) return;

    const card = this.cards[this.currentIndex];
    document.getElementById("cardFront").innerHTML = card.question; // CHANGE to innerHTML
    document.getElementById("cardBack").innerHTML = card.answer; // CHANGE to innerHTML

    this.updateControls();
    this.unflipCard();
    this.updateProgress();
  }

  flipCard() {
    const cardEl = document.querySelector(".card");
    this.isFlipped = !this.isFlipped;
    cardEl.classList.toggle("flipped");
  }

  unflipCard() {
    const cardEl = document.querySelector(".card");
    cardEl.classList.remove("flipped");
    this.isFlipped = false;
  }

  prevCard() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.showCard();
    }
  }

  nextCard() {
    if (this.currentIndex < this.cards.length - 1) {
      this.currentIndex++;
      this.showCard();
    }
  }

  updateControls() {
    document.getElementById("prevBtn").disabled = this.currentIndex === 0;
    document.getElementById("nextBtn").disabled =
      this.currentIndex === this.cards.length - 1;
  }

  updateProgress() {
    document.getElementById("progress").textContent =
      `${this.currentIndex + 1} / ${this.cards.length}`;
  }
}

new FlashcardApp();
