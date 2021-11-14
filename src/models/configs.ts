import { useState } from 'react';
import { extractDialogFile, chooseSpeakerDir, chooseSpeakerDialogueFile, Dialog, Character } from '@/utils/speakerFile';
import { FileSystemDir } from '@/utils/fileSystemAcess';

const useSpeakerConfig = () => {
  // 根目录
  const [rootDir, setRootDir] = useState<FileSystemDir | null>(null);
  const chooseRootDir = async () => {
    const dir = await chooseSpeakerDir();
    setRootDir(dir);
  };
  
  // 对话文件
  const [hasSelectDialogFile, setSelectedDialogFile] = useState(false);
  const [dialogList, setDialogList] = useState<Dialog[]>([]);
  const [characterList, setCharacterList] = useState<Character[]>([]);
  const chooseDialogueFile = async () => {
    const fileStr = await chooseSpeakerDialogueFile();
    setSelectedDialogFile(true);
    const dialogFileInfo = extractDialogFile(fileStr);
    setCharacterList(dialogFileInfo.characterList);
    setDialogList(dialogFileInfo.dialogList);
  };


  // appId和token

  return {
    rootDir,
    chooseRootDir,
    
    hasSelectDialogFile,
    chooseDialogueFile,

    characterList,
    setCharacterList,

    dialogList,
  };
};

export default useSpeakerConfig;