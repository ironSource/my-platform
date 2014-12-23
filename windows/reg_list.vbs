const HKEY_CURRENT_USER = &H80000001
const HKEY_LOCAL_MACHINE = &H80000002

Set stdout = WScript.StdOut

Set args = WScript.Arguments 

If args.Count = 0 Then
	WScript.Quit
End If

strKeyPath = args(0)

If IsNull(strKeyPath) Then
	WScript.Quit
End If

'stdout.Write(key & "123")

Set oReg=GetObject( "winmgmts:\root\default:StdRegProv")

'strKeyPath = "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall"

oReg.EnumKey HKEY_LOCAL_MACHINE, strKeyPath, arrValueNames, arrValueTypes

For i=0 To UBound(arrValueNames)

   StrText = arrValueNames(i)     
   
   oReg.GetStringValue HKEY_LOCAL_MACHINE,strKeyPath & "\" & StrText, "DisplayName",strName
   oReg.GetStringValue HKEY_LOCAL_MACHINE,strKeyPath & "\" & StrText, "DisplayVersion",strVersion
   StrText = StrText & ";" & StrName & ";" & StrVersion 
   stdout.WriteLine(StrText & "\n")
	
Next 
