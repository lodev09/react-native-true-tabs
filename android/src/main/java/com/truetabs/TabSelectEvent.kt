package com.truetabs

import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.events.Event

class TabSelectEvent(
  surfaceId: Int,
  viewId: Int,
  private val index: Int,
) : Event<TabSelectEvent>(surfaceId, viewId) {

  override fun getEventName() = "topTabSelect"

  override fun getEventData(): WritableNativeMap {
    return WritableNativeMap().apply {
      putInt("index", index)
    }
  }
}
