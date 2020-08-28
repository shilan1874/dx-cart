# dx-cart
购物车组件


## 安装
```
yarn add dx-cart
```

## 使用
```
import {
  dispatchCartInfo,
  getCartList,
  dispatchAddLocalCart,
  deleteCartItem,
  dispatchCartItemSelect,
  dispatchCartCount,
  dispatchCartItemCount,
  syncCartItemCount,
  getCartPrice
} from 'dx-cart'
```

## 功能
获取购物车信息
```
  dispatchCartInfo()
  // 返回值
  return {
    cartInfo: {
      count,
      cartGoods,
      itemCount,
      itemSelected,
      cartList
    },
  }
```
获取购物车商品列表
```
  getCartList()
  // 返回值
  return cartList
```
添加至购物车
```
  const cartItem = {}  // 商品项
  dispatchAddLocalCart(cartItem)
```
删除购物车商品
```
  const ids = [skuId] // 商品skuId
  deleteCartItem(ids)
```
勾选商品
```
  const itemId = 0 // 当前勾选商品的itemId
  dispatchCartItemSelect(itemId)
```
获取购物车数量
```
  dispatchCartCount()
  // 返回值
  return 0
```
购物车单个商品数量
```
  const itemId = 0 // 当前商品的itemId
  const count = 0 // 商品数量
  dispatchCartItemCount({ itemId, count })
```
更新单个商品数量
```
  const itemId = 0 // 当前商品的itemId
  const changeCount = 0 // 修改后的商品数量
  syncCartItemCount({ itemId, changeCount })
```

计算商品价格
```
  const saleItems = [] // 商品列表
  getCartPrice({ saleItems })
  // 返回值
  return {
    discountsTotalPrice // 总价格
  }
```