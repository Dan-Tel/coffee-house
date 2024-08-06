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

  const modal = document.querySelector(".menu__modal");
  const modalBackground = document.querySelector(".modal__background");
  const modalImg = document.querySelector(".modal__img");
  const modalTitle = document.querySelector(".modal__title");
  const modalDescription = document.querySelector(".modal__description");
  const modalSizesInputs = document.querySelector(".modal__sizes-inputs");
  const modalAdditivesInputs = document.querySelector(
    ".modal__additives-inputs"
  );
  const modalPrice = document.querySelector(".modal__price h3:nth-child(2)");
  const modalCloseBtn = document.querySelector(".modal__close-btn");

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
      const menuItem = document.createElement("div");
      menuItem.classList = "menu__item";
      menuItem.innerHTML = `
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
      `;

      menuItem.addEventListener("click", () => {
        let sizePriceAddition = 0;
        let additivesPriceAddition = 0;

        modalImg.src = `../assets/images/${category}-${i + 1}.jpg`;
        modalTitle.innerHTML = product.name;
        modalDescription.innerHTML = product.description;
        modalPrice.innerHTML = `$${product.price}`;

        modalSizesInputs.innerHTML = "";
        for (let i = 0; i < 3; i++) {
          const size = ["s", "m", "l"][i];

          const sizeBtn = document.createElement("button");
          sizeBtn.className = "modal__size-btn menu__btn fs-link-btn";
          if (i == 0) sizeBtn.classList.add("active");

          sizeBtn.innerHTML = `
            <div class="menu__btn-icon">${size}</div>
            ${product.sizes[size].size}
          `;

          sizeBtn.setAttribute(
            "data-add-price",
            product.sizes[size]["add-price"]
          );

          modalSizesInputs.append(sizeBtn);
        }

        modalAdditivesInputs.innerHTML = "";
        for (let i = 0; i < 3; i++) {
          const additivesBtn = document.createElement("button");
          additivesBtn.className = "modal__additives-btn menu__btn fs-link-btn";

          additivesBtn.innerHTML = `
            <div class="menu__btn-icon">${i + 1}</div>
            ${product.additives[i].name}
          `;

          additivesBtn.setAttribute(
            "data-add-price",
            product.additives[i]["add-price"]
          );

          modalAdditivesInputs.append(additivesBtn);
        }

        const modalSizeBtns = document.querySelectorAll(".modal__size-btn");
        modalSizeBtns.forEach((sizeBtn) => {
          sizeBtn.addEventListener("click", () => {
            modalSizeBtns.forEach((item) => item.classList.remove("active"));
            sizeBtn.classList.add("active");

            sizePriceAddition = +sizeBtn.dataset.addPrice;

            const totalPrice =
              +product.price + sizePriceAddition + additivesPriceAddition;
            modalPrice.innerHTML = `$${totalPrice.toFixed(2)}`;
          });
        });

        const modalAdditivesBtns = document.querySelectorAll(
          ".modal__additives-btn"
        );
        modalAdditivesBtns.forEach((additivesBtn) => {
          additivesBtn.addEventListener("click", () => {
            additivesBtn.classList.toggle("active");

            if (additivesBtn.classList.contains("active")) {
              additivesPriceAddition += +additivesBtn.dataset.addPrice;
            } else {
              additivesPriceAddition -= +additivesBtn.dataset.addPrice;
            }

            const totalPrice =
              +product.price + sizePriceAddition + additivesPriceAddition;
            modalPrice.innerHTML = `$${totalPrice.toFixed(2)}`;
          });
        });

        modal.classList.toggle("active");
      });

      menuList.append(menuItem);
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

  modalCloseBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  modalBackground.addEventListener("click", () => {
    modal.classList.remove("active");
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
