async function init() {
  const fragment = document.createDocumentFragment();
  // const identities = Logic.identities();
  const unsortedIdentities = await browser.contextualIdentities.query({});
  const containerOrderStorage = await browser.storage.local.get([CONTAINER_ORDER_STORAGE_KEY]);
  const containerOrder =
      containerOrderStorage && containerOrderStorage[CONTAINER_ORDER_STORAGE_KEY];

  var identities = unsortedIdentities.map((identity) => {
    if (containerOrder) {
      identity.order = containerOrder[identity.cookieStoreId];
    }
    return identity;
  }).sort((i1, i2) => i1.order - i2.order);

  for (const identity of identities) {
    const tr = document.createElement("tr");
    tr.classList.add("menu-item", "hover-highlight");
    tr.setAttribute("data-cookie-store-id", identity.cookieStoreId);
    const td = document.createElement("td");
    td.innerHTML = Utils.escaped`
        <div class="menu-icon">
          <div class="usercontext-icon"
            data-identity-icon="${identity.icon}"
            data-identity-color="${identity.color}">
          </div>
        </div>
        <span class="menu-text">${identity.name}</span>
        <img alt="" class="page-action-flag flag-img" src="/img/flags/.png"/>
        `;

    tr.appendChild(td);
    fragment.appendChild(tr);

    Utils.addEnterHandler(tr, async () => {
      Utils.alwaysOpenInContainer(identity);
      window.close();
    });
  }

  const list = document.querySelector("#picker-identities-list");
  list.innerHTML = "";
  list.appendChild(fragment);

  MozillaVPN.handleContainerList(identities);

  // Set the theme
  Utils.applyTheme();
}

init();
