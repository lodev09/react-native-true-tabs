package com.truetabs

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.TrueTabsViewManagerDelegate
import com.facebook.react.viewmanagers.TrueTabsViewManagerInterface

@ReactModule(name = TrueTabsViewManager.NAME)
class TrueTabsViewManager : SimpleViewManager<TrueTabsView>(),
  TrueTabsViewManagerInterface<TrueTabsView> {

  private val delegate = TrueTabsViewManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<TrueTabsView> = delegate

  override fun getName(): String = NAME

  override fun createViewInstance(context: ThemedReactContext): TrueTabsView {
    return TrueTabsView(context)
  }

  override fun setItems(view: TrueTabsView, items: ReadableArray?) {
    if (items == null) return
    val tabItems = mutableListOf<TabItemData>()
    for (i in 0 until items.size()) {
      val map = items.getMap(i) ?: continue
      tabItems.add(
        TabItemData(
          title = map.getString("title") ?: "",
          sfSymbol = if (map.hasKey("sfSymbol")) map.getString("sfSymbol") else null,
          iconUri = if (map.hasKey("iconUri")) map.getString("iconUri") else null,
          badge = if (map.hasKey("badge")) map.getString("badge") else null,
        )
      )
    }
    view.setItems(tabItems)
  }

  override fun setSelectedIndex(view: TrueTabsView, value: Int) {
    view.setSelectedIndex(value)
  }

  override fun setTranslucent(view: TrueTabsView, value: Boolean) {
    view.setTranslucent(value)
  }

  override fun setTintColor(view: TrueTabsView, value: Int?) {
    view.setTintColor(value)
  }

  override fun setActiveTintColor(view: TrueTabsView, value: Int?) {
    view.setActiveTintColor(value)
  }

  override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> {
    return mapOf(
      "topTabSelect" to mapOf("registrationName" to "onTabSelect")
    )
  }

  companion object {
    const val NAME = "TrueTabsView"
  }
}
