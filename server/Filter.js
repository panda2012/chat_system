
var fs = require("fs")
var vFilter = []
function Filter(){
    this.FindSubString =function(str, strSub){
	var iPos = 0;
	var iSize = str.length - strSub.length;
	while (iPos <= iSize)
	{
	    if (strnicmp(str + iPos, strSub, strSub.length) == 0)
		return iPos;
	    iPos ++;
	}
	return -1;
    }




    //Load Illegal word file
    this.LoadFilter =function(){
	fs.readFile( "./list.txt", "utf-8", function( err, data ){
	
	    if( err ){
		console.log( "文件读取错误" );
	    }else {
		vFilter = data.split("\n");
	   console.log(vFilter);
	    //--console.log(data);
		return vFilter;
	    }
	});
    
    
	//console.log(vFilter);
	return true;
    }

/*'''

function Check(str, bReplace){
    list<string>::iterator iterBeg = vFilter.begin();
    list<string>::iterator iterEnd = vFilter.end();

    bool bReturn = true;
    for (; iterBeg != iterEnd; ++ iterBeg)
    {
	if (str.find((*iterBeg)) != string::npos)
	{
	    //if(bReplace==false)
	    //{
	    bReturn = false;
	    break;
	    //}
	}
    }
    return bReturn;

}


*/

/*function Check(str, bReplace, bCaseSensitive){
    list<string>::iteratoriterBeg = vFilter.begin();
    list<string>::iteratoriterEnd = vFilter.end();

    bool bPass = true;
    string strReplace;
    int iPos = -1;
    string strTemp;

    for (; iterBeg != iterEnd; ++iterBeg)
    {
	strTemp = (*iterBeg);
	iPos = FindSubString(str, strTemp );
	while (iPos  != -1)
	{
	    if (bReplace==false)
		return false;

	    bPass = false;
	    strReplace.clear();
	    for (int i = 0; i < (int)iterBeg->size(); ++i)
		strReplace += "*";
	    str.replace(iPos, iterBeg->size(), strReplace.c_str());
	    iPos = FindSubString(str, *iterBeg );
	}
    }

    return bPass;
}
*/
}

module.exports = Filter
