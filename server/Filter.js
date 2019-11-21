
const fs = require("fs")
var vFilter = []
function FindSubString(str, strSub){
    var iPos = 0;
   /*'''
    var iSize = (int)str.size() - (int)strSub.size();
    while (iPos <= iSize)
    {
	if (strnicmp(str.c_str()+ iPos, strSub.c_str(), strSub.size()) == 0)
	    return iPos;
	iPos ++;
    }
    '''*/

    return -1;
}




//载入非法字符文件

function LoadFilter(){
    fs.readFile( "./list.txt", "utf-8", function( err, data ){
	
	if( err ){
	    console.log( "文件读取错误" );
	}else {
	    vFilter.push(data);
	    console.log(vFilter);
	    console.log(typeof(data));
	}
    });
    

    console.log(vFilter);
    /*vFilter.forEach(function(name){
	console.log(name);
    });
    
    var  arr = []
    for(i = 1 ; i<= 20; i++){
	arr.push(i);
    };
    console.log(arr);

    for(i = 0 ; i<= arr.length ; i++){

	console.log(i);
    };
    */　　

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




function Check(str, bReplace, bCaseSensitive){
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
'''*/
LoadFilter();
