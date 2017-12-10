/**
 * 组合模式 宏命令 (macro command)
 */

var MacroCommand = function(){
    return {
        commandsList: [],
        add: function( command ){
            this.commandsList.push( command ); 
        },
        execute: function(){
            for ( var i = 0, command; i < this.commandsList.length; i++){
                command = this.commandsList[i];
                command.execute(); 
            }
        } 
    }
};

var openAcCommand = { 
    execute: function(){
        console.log( 'open air conditioner' ); 
    }
};


/**
 * the television and sound are in series, so we can use a macro command to open tv and sound
 */
var openTvCommand = { 
    execute: function(){
        console.log( 'open tv' ); 
    }
};
var openSoundCommand = { 
    execute: function(){
        console.log( '    ' );
    }
};
var macroCommand1 = MacroCommand(); 
macroCommand1.add( openTvCommand );
macroCommand1.add( openSoundCommand );



var closeDoorCommand = {
    execute: function(){
        console.log( 'close door' ); 
    }
}

var openPcCommand = {
    execute: function(){
        console.log( 'open pc' ); 
    }
}


var openQQCommand = {
    execute: function(){
        console.log( 'open qq' ); 
    }
}

var macroCommand2 = MacroCommand(); 
macroCommand2.add(closeDoorCommand);
macroCommand2.add(openPcCommand);
macroCommand2.add(openQQCommand);


/**
 * now combine all the commands to a super command
 */
var macroCommand = MacroCommand();
macroCommand.add(openAcCommand);
macroCommand.add(macroCommand1);
macroCommand.add(macroCommand2);



/**
 * execute the super command
 */
(function( command ){ 
      setTimeout(function(){
        command.execute(); 
      },1000)
})( macroCommand );