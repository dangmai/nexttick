#SingleInstance, Force
SendMode Input
SetWorkingDir, %A_ScriptDir%

; Constants
HWND_BOTTOM := 1
HWND_NOTOPMOST := -2
HWND_TOP := 0
HWND_TOPMOST := -1

SWP_ASYNCWINDOWPOS := 0x4000
SWP_DEFERERASE := 0x2000
SWP_DRAWFRAME := 0x0020
SWP_FRAMECHANGED := 0x0020
SWP_HIDEWINDOW := 0x0080
SWP_NOACTIVATE := 0x0010
SWP_NOCOPYBITS := 0x0100
SWP_NOMOVE := 0x0002
SWP_NOOWNERZORDER := 0x0200
SWP_NOREDRAW := 0x0008
SWP_NOREPOSITION := 0x0200
SWP_NOSENDCHANGING := 0x0400
SWP_NOSIZE := 0x0001
SWP_NOZORDER := 0x0004
SWP_SHOWWINDOW := 0x0040

; Variables
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
    DllCall("SetWindowPos", "uint", controlHandle, "uint", childHandle,  "uint", 0, "uint", 0, "uint", 0, "uint", 0, SWP_NOSIZE | SWP_SHOWWINDOW)
  } else {
    Sleep 1000
  }
} Until (parentHandle != 0 && controlHandle != 0 && childHandle != 0)

