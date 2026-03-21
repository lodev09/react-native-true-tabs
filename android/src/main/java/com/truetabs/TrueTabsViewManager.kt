package com.truetabs

import android.graphics.Color
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.TrueTabsViewManagerInterface
import com.facebook.react.viewmanagers.TrueTabsViewManagerDelegate

@ReactModule(name = TrueTabsViewManager.NAME)
class TrueTabsViewManager : SimpleViewManager<TrueTabsView>(),
  TrueTabsViewManagerInterface<TrueTabsView> {
  private val mDelegate: ViewManagerDelegate<TrueTabsView>

  init {
    mDelegate = TrueTabsViewManagerDelegate(this)
  }

  override fun getDelegate(): ViewManagerDelegate<TrueTabsView>? {
    return mDelegate
  }

  override fun getName(): String {
    return NAME
  }

  public override fun createViewInstance(context: ThemedReactContext): TrueTabsView {
    return TrueTabsView(context)
  }

  @ReactProp(name = "color")
  override fun setColor(view: TrueTabsView?, color: Int?) {
    view?.setBackgroundColor(color ?: Color.TRANSPARENT)
  }

  companion object {
    const val NAME = "TrueTabsView"
  }
}
