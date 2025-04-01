const idCartValueKey = "id-cart-value";

export const getUniqueList = (type, idList, cartList) => {
  let uniqueList = [];

  if (type === "glycanID") {
    uniqueList = idList.filter(obj => !cartList.includes(obj));
  } else if (type === "proteinID") {
    let ids = cartList.map(obj => obj.uniprot_canonical_ac);
    uniqueList = idList.filter(obj => !ids.includes(obj.uniprot_canonical_ac));
  } else if (type === "glycanList") {
    let ids = cartList.map(obj => obj.listCacheId);
    uniqueList = idList.filter(obj => !ids.includes(obj.listCacheId));
  } else if (type === "proteinList") {
    let ids = cartList.map(obj => obj.listCacheId);
    uniqueList = idList.filter(obj => !ids.includes(obj.listCacheId));
  }

  return uniqueList;
}

export const addIDsToStore = (type, idList) => {
  let totlaCartCount = 0;
  try {
    const parsedValue1 = localStorage.getItem(idCartValueKey);
    let parsedValue = JSON.parse(parsedValue1);
    if (parsedValue && parsedValue.idCart[type]) {
        let cartList =  parsedValue.idCart[type];
        let uniqueList = getUniqueList(type, idList, cartList);
        parsedValue.idCart[type].push(...uniqueList);
        parsedValue.idCart.idCartCount += uniqueList.length;
    } else if (parsedValue && parsedValue.idCart) {
      parsedValue.idCart[type] = [];
       parsedValue.idCart[type].push(...idList);
       parsedValue.idCart.idCartCount += idList.length;
    } else {
      parsedValue = {
        "idCart":{
          [type]: [],
          idCartCount: idList.length
        }
      }
        parsedValue.idCart[type].push(...idList);
    }
    totlaCartCount =  parsedValue.idCart.idCartCount;
    localStorage.setItem(idCartValueKey, JSON.stringify(parsedValue));
  } catch (err) {
  }
  return totlaCartCount;
};

export const getIDsFromStore = () => {
  let idCartValue = [];
  try {
    const parsedValue1 =  localStorage.getItem(idCartValueKey);
    let parsedValue = JSON.parse(parsedValue1);
    if (parsedValue) {
      idCartValue = parsedValue.idCart;
    }
  } catch (err) {
  }

  return idCartValue;
};

export const getCartCount = () => {
  let idCartCount = 0;
  try {
    const parsedValue1 =  localStorage.getItem(idCartValueKey);
    let parsedValue = JSON.parse(parsedValue1);
    if (parsedValue && parsedValue.idCart && parsedValue.idCart.idCartCount) {
      idCartCount = parsedValue.idCart.idCartCount;
    }
  } catch (err) {
  }

  return idCartCount;
};

export const deleteID = (type, id) => {
  let totalCartCount = 0;
  try {
    const parsedValue1 =  localStorage.getItem(idCartValueKey);
    let parsedValue = JSON.parse(parsedValue1);
    let updateIDArr= [];

    if (parsedValue && parsedValue.idCart ) {
      if (type === "glycanID") {
        let len = parsedValue.idCart[type].length;
        updateIDArr = parsedValue.idCart[type].filter(temp => temp !== id);
        len = len - updateIDArr.length;
        parsedValue.idCart.idCartCount -= len;
      } else if (type === "glycanList" || type === "proteinList") {
        let len = parsedValue.idCart[type].length;
        updateIDArr = parsedValue.idCart[type].filter(temp => temp.listCacheId !== id);
        len = len - updateIDArr.length;
        parsedValue.idCart.idCartCount -= len;
      } else if (type === "proteinID") {
        let len = parsedValue.idCart[type].length;
        updateIDArr = parsedValue.idCart[type].filter(temp => temp.uniprot_canonical_ac !== id);
        len = len - updateIDArr.length;
        parsedValue.idCart.idCartCount -= len;
      }
    }
    totalCartCount = parsedValue.idCart.idCartCount;
    parsedValue.idCart[type] = updateIDArr;
    localStorage.setItem(idCartValueKey, JSON.stringify(parsedValue));

  } catch (err) {
  }
  return totalCartCount;
};


export const clearCartType = (type) => {
  let totalCartCount = 0;
  try {
    const parsedValue1 =  localStorage.getItem(idCartValueKey);
    let parsedValue = JSON.parse(parsedValue1);
    let updateIDArr= [];

    if (parsedValue && parsedValue.idCart ) {
      if (type === "glycanID") {
        let len = parsedValue.idCart[type].length;
        updateIDArr = [];
        parsedValue.idCart.idCartCount -= len;
      } else if (type === "glycanList" || type === "proteinList") {
        let len = parsedValue.idCart[type].length;
        updateIDArr = [];
        parsedValue.idCart.idCartCount -= len;
      } else if (type === "proteinID") {
        let len = parsedValue.idCart[type].length;
        updateIDArr = [];
        parsedValue.idCart.idCartCount -= len;
      }
    }
    totalCartCount = parsedValue.idCart.idCartCount;
    parsedValue.idCart[type] = updateIDArr;
    localStorage.setItem(idCartValueKey, JSON.stringify(parsedValue));

  } catch (err) {
  }
  return totalCartCount;
};


export const updateIDCartObject = (type, oldListCacheId, obj) => {
  try {
    const parsedValue1 =  localStorage.getItem(idCartValueKey);
    let parsedValue = JSON.parse(parsedValue1);
    let updateIDArr= [];

    if (parsedValue && parsedValue.idCart ) {
      if (type === "glycanList" || type === "proteinList") {
        updateIDArr = parsedValue.idCart[type].filter(temp => temp.listCacheId !== oldListCacheId);
        updateIDArr.push({...obj});
      }
    }
    parsedValue.idCart[type] = updateIDArr;
    localStorage.setItem(idCartValueKey, JSON.stringify(parsedValue));

  } catch (err) {
  }
};
