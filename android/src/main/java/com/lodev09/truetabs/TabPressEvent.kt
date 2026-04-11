package com.lodev09.truetabs

import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.events.Event

class TabPressEvent(surfaceId: Int, viewId: Int, private val index: Int) : Event<TabPressEvent>(surfaceId, viewId) {
  override fun getEventName() = "topTabPress"

  override fun getEventData(): WritableNativeMap =
    WritableNativeMap().apply {
      putInt("index", index)
    }
}
