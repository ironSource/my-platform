const HKEY_CURRENT_USER = &H80000001
Const HKEY_LOCAL_MACHINE = &H80000002

strComputer = "."

Set oReg=GetObject( _
   "winmgmts:\root\default:StdRegProv")

strKeyPath = "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall"

'strValueName = "HistoryBufferSize"

'oReg.GetDWORDValue _
'   HKEY_CURRENT_USER,strKeyPath,strValueName,dwValue

'WScript.Echo "Current History Buffer Size: " & dwValue

oReg.EnumKey HKEY_LOCAL_MACHINE, strKeyPath, arrValueNames, arrValueTypes 

objTxt = ""
 
Set stdout = WScript.StdOut

For i=0 To UBound(arrValueNames)

   StrText = arrValueNames(i)     
   
   oReg.GetStringValue HKEY_LOCAL_MACHINE,strKeyPath & "\" & StrText, "DisplayName",strName 
   oReg.GetStringValue HKEY_LOCAL_MACHINE,strKeyPath & "\" & StrText, "DisplayVersion",strVersion 
   StrText = StrText & ";" & StrName & ";" & StrVersion 
   stdout.WriteLine StrText & "\n"
	
Next 

'WScript.Echo objText