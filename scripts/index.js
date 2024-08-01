const pageTitle = document.title;
let isPageLoaded = false;
let isScrolling = false;

window.addEventListener("load", () => {
  isPageLoaded = true;
});
window.addEventListener("unload", () => {
  isPageLoaded = false;
});

if (pageTitle == "Menu") {
  let defaultLoadSize = Infinity;
  let loadSize = defaultLoadSize;
  let currentCategoryId = 0;

  const menuList = document.querySelector(".menu__list");
  const menuFilterBtns = document.querySelectorAll(".menu__filter-btn");
  const menuCategories = ["coffee", "tea", "dessert"];
  const loadMoreBtn = document.querySelector(".menu__load-btn");

  async function getAllProducts(category, menuList) {
    const res = await fetch("../assets/data/products.json");
    const products = await res.json();

    const filteredProducts = products.filter(
      (product) => product.category == category
    );

    if (loadSize >= filteredProducts.length) loadMoreBtn.style.display = "none";
    else loadMoreBtn.style.display = "";

    menuList.innerHTML = "";
    filteredProducts.slice(0, loadSize).forEach((product, i) => {
      menuList.insertAdjacentHTML(
        "beforeend",
        `
        <div class="menu__item">
          <div class="item-menu__img-wrapper">
            <img class="item-menu__img" alt="Irish coffee" src="../assets/images/${category}-${
          i + 1
        }.jpg">
          </div>
          <div class="item-menu__text">
            <h3 class="fs-heading-3">${product.name}</h3>
            <p class="fs-medium">${product.description}</p>
            <h3 class="item-menu__price fs-heading-3">$${product.price}</h3>
          </div>
        </div>
        `
      );
    });
  }

  menuFilterBtns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      if (i == currentCategoryId) return;

      menuFilterBtns.forEach((btn) => btn.classList.remove("active"));
      btn.classList.add("active");
      loadSize = defaultLoadSize;
      currentCategoryId = i;
      getAllProducts(menuCategories[currentCategoryId], menuList);
    });
  });

  loadMoreBtn.addEventListener("click", () => {
    loadSize += 4;
    getAllProducts(menuCategories[currentCategoryId], menuList);
  });

  function resizeLoadSize() {
    const width = document.documentElement.clientWidth;

    let newLoadSize = Infinity;
    if (width <= 768) {
      newLoadSize = 4;
    }

    if (defaultLoadSize != newLoadSize) {
      defaultLoadSize = newLoadSize;
      loadSize = defaultLoadSize;
      getAllProducts(menuCategories[currentCategoryId], menuList);
    }
  }

  window.addEventListener("resize", resizeLoadSize);
  document.addEventListener("DOMContentLoaded", () => {
    getAllProducts("coffee", menuList);
    resizeLoadSize();
  });
}

if (pageTitle == "Menu" || pageTitle == "Home") {
  const burgerMenuBtn = document.querySelector(".header__burger-menu-btn");
  const burgerMenu = document.querySelector(".header__burger-menu");
  const burgerLinks = burgerMenu.querySelectorAll(".fs-burger-link");

  burgerMenuBtn.addEventListener("click", () => {
    if (!isPageLoaded) return;

    window.scrollTo(0, 0);
    burgerMenu.classList.toggle("active");
  });

  burgerLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (!isPageLoaded) return;

      window.scrollTo(0, 0);
      burgerMenu.classList.remove("active");
    });
  });

  window.addEventListener("resize", () => {
    const width = document.documentElement.clientWidth;

    if (width > 768) {
      burgerMenu.classList.remove("active");
    }
  });
}
