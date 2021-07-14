/* eslint-disable no-control-regex */
const BG = new RegExp('\x00', 'g');
const FG = new RegExp('\x01', 'g');

const parseRow = (row) => row
  .replace(/-/g, BG.source)
  .replace(/#/g, FG.source)
  .split(' ');

const ALPHA_MAPPINGS = [
  '#### ###- -### ###- #### #### #### #--# ### -### #--# #-- #---# #---# -##- ###- -##-- ###- -### ##### #---# #---# #-----# #---# #---# #####',
  '#--# #--# #--- #--# #--- #--- #--- #--# -#- --#- #-#- #-- ##-## ##--# #--# #--# #--#- #--# #--- --#-- #---# #---# #-----# -#-#- -#-#- ---#-',
  '#### ###- #--- #--# ###- ###- #-## #### -#- --#- ##-- #-- #-#-# #-#-# #--# ###- #--#- ###- -##- --#-- #---# #---# #--#--# --#-- --#-- --#--',
  '#--# #--# #--- #--# #--- #--- #--# #--# -#- #-#- #-#- #-- #---# #--## #--# #--- #--#- #-#- ---# --#-- #---# -#-#- #-#-#-# -#-#- --#-- -#---',
  '#--# ###- -### ###- #### #--- #### #--# ### -##- #--# ### #---# #---# -##- #--- -#### #--# ###- --#-- -###- --#-- -#---#- #---# --#-- #####',
].map(parseRow);

const NUM_MAPPINGS = [
  '### -#- ### ### #-# ### ### ### ### ###',
  '#-# ##- --# --# #-# #-- #-- --# #-# #-#',
  '#-# -#- ### ### ### ### ### --# ### ###',
  '#-# -#- #-- --# --# --# #-# --# #-# --#',
  '### ### ### ### --# ### ### --# ### ###',
].map(parseRow);

const SPECIAL_CHARS = {
  chars: '_ ~!@#.:()*+-=?|/\\^\'"',
  mappings: [
    '--- - ----- # -###- --#--# - - -# #- --- --- --- --- -###- # --- --- -#- # #-#',
    '--- - -#--- # #--## -##### - # #- -# #-# -#- --- ### #---# # --# #-- #-# # #-#',
    '--- - #-#-# # #-#-# -#--#- - - #- -# -#- ### ### --- --##- # -#- -#- --- - ---',
    '--- - ---#- - #--## #####- - # #- -# #-# -#- --- ### --#-- # #-- --# --- - ---',
    '### - ----- # -##-- #--#-- # - -# #- --- --- --- --- --#-- # --- --- --- - ---',
  ].map(parseRow),
};

function getCharMapping(char, row) {
  if (!char) return '';

  const code = char.charCodeAt(0);
  // a-z
  if (code >= 97 && code <= 122) {
    const index = code - 97;
    return ALPHA_MAPPINGS[row][index];
  }

  // 0-9
  if (code >= 48 && code <= 57) {
    const index = code - 48;
    return NUM_MAPPINGS[row][index];
  }

  // Special chars
  const index = SPECIAL_CHARS.chars.indexOf(char === '\t' ? ' ' : char);
  if (index > -1) {
    return SPECIAL_CHARS.mappings[row][index];
  }

  // Replace invalid char with underscore
  return SPECIAL_CHARS.mappings[row][0];
}

export default getCharMapping;
export {
  BG,
  FG,
};
