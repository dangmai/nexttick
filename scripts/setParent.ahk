#SingleInstance, Force
SendMode Input
SetWorkingDir, %A_ScriptDir%

parentHandle := 0
controlHandle := 0
childHandle := 0

Loop {
  parentHandle := DllCall( "FindWindowEx", "uint", 0, "uint", 0, "uint", 0, "str", "NextTick - Overlay")
  controlHandle := DllCall( "FindWindowEx", "uint", 0, "uint", 0, "uint", 0, "str", "NextTick - Control")
  childHandle := DllCall( "FindWindowEx", "uint", 0, "uint", 0, "uint", 0, "str", "Counter-Strike: Global Offensive")

  ; MsgBox %parentHandle%, %controlHandle%, %childHandle%
  If (parentHandle != 0 && controlHandle != 0 && childHandle != 0) {
    DllCall("SetParent", "uint", childHandle, "uint", parentHandle)
    DllCall("SetWindowPos", "uint", controlHandle, "uint", childHandle,  "uint", 0, "uint", 0, "uint", 0, "uint", 0, 0x0001 | 0x0040)
  } else {
    Sleep 1000
  }
} Until (parentHandle != 0 && controlHandle != 0 && childHandle != 0)

