import NP from 'number-precision';

function setStorage(key, value) {
  localStorage.setItem(key, value);
}

function getStorage(key) {
  return localStorage.getItem(key)
}

/**
 * 设置购物车信息
 */
function dispatchCartInfo() {
  const count = getStorage('count') || 0;
  const cartGoods = JSON.parse(getStorage('cartGoods') || '[]');
  const itemCount = JSON.parse(getStorage('itemCount') || '{}');
  const itemSelected = JSON.parse(getStorage('itemSelected') || '[]');
  return {
    cartInfo: {
      count,
      cartGoods,
      itemCount,
      itemSelected,
      cartList: getCartList()
    },
  }
}

/**
 * 获取购物车商品列表
 * 将本地存储cartGoods格式化成购物车所需格式
 */
const getCartList = () => {
  const data = getStorage('cartGoods');
  const formattedData = formatCartGoods(JSON.parse(data));
  return formattedData
};
function formatCartGoods(data) {
  if (data.length === 0) {
    return []
  }
  const formattedData = data.map((item) => {
    const skuData = JSON.parse(item.skuJson);
    const formattedSkuJson = JSON.stringify({
      shopId: item.storeId, // todo 待处理来源
      sku: skuData.skuDTO,
      itemWhole: skuData.itemWholeDTO,
    });
    return {
      id: item.id,
      itemId: item.skuId,
      skuId: item.skuId,
      storeCode: item.storeId,
      storeName: item.storeName,
      skuAmount: item.skuQty,
      skuName: item.skuName,
      skuJson: formattedSkuJson,
      detailPrice: item.skuPrice,
    }
  });
  // 按店铺分组
  const storeCodeList = Array.from(
    new Set(formattedData.map((item) => item.storeCode)),
  );
  const shopItemList = storeCodeList.map((item) => {
    return {
      itemList: [
        {
          activityCommodityList: [],
        },
      ],
      storeCode: item,
      storeName: '',
      storeLogo: '', // todo 需商品详情接口中提供
    }
  });
  formattedData.forEach((item) => {
    const shopItem = shopItemList.find((v) => v.storeCode === item.storeCode);
    if (!shopItem.storeName) {
      shopItem.storeName = item.storeName;
    }
    shopItem.itemList[0].activityCommodityList.push(item);
  });
  return {
    cartList: shopItemList,
  }
}

/**
 * 添加至购物车
 */
function dispatchAddLocalCart(cartItem) {
  const res = getStorage('cartGoods');
  const cartGoods = JSON.parse(res || '[]');
  // 判定是否是重复商品
  let existIndex = -1;
  cartGoods.length && cartGoods.forEach((item, index) => {
    if (
      cartItem.storeId === item.storeId &&
      cartItem.itemId === item.itemId &&
      cartItem.skuId === item.skuId
    ) {
      existIndex = index;
    }
  });
  if (existIndex === -1) {
    cartGoods.push(cartItem);
  } else {
    cartGoods[existIndex].skuQty += cartItem.skuQty;
  }
  setStorage('cartGoods', JSON.stringify(cartGoods));

  const count = cartGoods.length;
  setStorage('count', count);
}


/**
 * 删除购物车商品
 * @ids {array} 数组id
 */
const deleteCartItem = (ids) => {
  const cartGoods = JSON.parse(getStorage('cartGoods') || '[]');
  const newCartGoods = cartGoods.filter((item) => !ids.includes(item.skuId));
  setStorage('cartGoods', JSON.stringify(newCartGoods));
  dispatchCartInfo();
};

/**
 * 购物车选中状态
 * @itemId 当前选择的商品 itemId
 */
function dispatchCartItemSelect(itemId) {
  let itemSelected;
  const oldItem = JSON.parse(getStorage('itemSelected') || '[]');
  if (oldItem.includes(itemId)) {
    itemSelected = oldItem.filter(
      (item) => item !== itemId,
    );
  } else {
    itemSelected = [...oldItem, itemId];
  }
  setStorage('itemSelected', JSON.stringify(itemSelected));
  dispatchCartInfo();
}

/**
 * 获取购物车数量
 */
function dispatchCartCount() {
  const res = getStorage('cartGoods');
  const count = res ? JSON.parse(res).length : 0;
  setStorage('count', count);
}

/**
 * 购物车单个商品数量
 */
function dispatchCartItemCount({ itemId, count }) {
  const oldCount = JSON.parse(getStorage('itemCount') || '{}');
  const itemCount = {
    ...oldCount,
    [itemId]: count,
  };
  setStorage('itemCount', JSON.stringify(itemCount));
}

/**
 * 同步单个商品数量
 */
const syncCartItemCount = ({
  itemId,
  changeCount,
}) => {
  const cartGoods = JSON.parse(getStorage('cartGoods') || '[]');
  if (cartGoods.length) {
    const cartItem = cartGoods.find((item) => item.skuId === itemId);
    cartItem.skuQty += changeCount;
  }
  setStorage('cartGoods', JSON.stringify(cartGoods));
  dispatchCartInfo();
};

/**
 * 计算购物车选中商品价格
 * @saleItems 选择项商品的集合
 * @discountsTotalPrice 购物车商品价格
 */
const getCartPrice = ({ saleItems }) => {
  let data;
  if (saleItems.length === 0) {
    data = {};
  } else {
    let discountsTotalPrice = 0;
    saleItems.forEach((item) => {
      discountsTotalPrice += NP.times(item.detailPrice, item.skuQty);
    });
    return {
      discountsTotalPrice,
    }
  }
  return data
};

export { deleteCartItem, dispatchAddLocalCart, dispatchCartCount, dispatchCartInfo, dispatchCartItemCount, dispatchCartItemSelect, getCartList, getCartPrice, syncCartItemCount };
//# sourceMappingURL=index.es.js.map
