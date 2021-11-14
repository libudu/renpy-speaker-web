import { chooseDir } from '@/utils/fileSystemAcess';
import { FileSystemDir } from '@/utils/fileSystemAcess';
import { fetchTextVoice } from './aliyunTts';
import PromisePool  from 'es6-promise-pool';

const SPEAKER_CONFIG_NAME = 'speaker.config.json';

// 选择目录
export const chooseSpeakerDir = async () => {
  const rootDir = await chooseDir();
  const configStr = await rootDir.readTextFile(SPEAKER_CONFIG_NAME) || '{}';
  await rootDir.writeFile(SPEAKER_CONFIG_NAME, configStr);
  return rootDir;
}

// 选择对话文件
export const chooseSpeakerDialogueFile = async () => {
  const file = (await showOpenFilePicker({
    types: [
      {
        description: 'dialogue.tab',
        accept: {
          'text/*.tab': ['.tab']
        }
      },
    ],
    multiple: false,
  }))[0];
  const text = await (await file.getFile()).text();
  return text;
};

export interface Dialog {
  label: string;
  char: string;
  text: string;
};

export interface Character {
  name: string;
  voiceId: string | null;
}

// 解析脚本文件
export const extractDialogFile = (dialogStr: string): {
  characterList: Character[];
  dialogList: Dialog[];
} => {
  const dialogRowList = dialogStr
    // 按行划分，去掉首尾
    .split('\r\n').slice(1, -1)
    // 每行切分为成分
    .map(line => line.split('\t'));
  const dialogList = dialogRowList.map(line => ({
    label: line[0],
    char: line[1],
    text: line[2],
  }));
  // 提取所有角色
  const charSet = new Set(dialogRowList.map(dialog => dialog[1]));
  // 去除空角色
  charSet.delete('');
  // 转换为列表
  const characterList: Character[] = [...charSet.keys()].map(c => ({ name: c, voiceId: null }));
  return {
    characterList,
    dialogList,
  };
};

export interface DownloadErrorInfo {
  dialog: Dialog;
  error: string;
}

// 下载对话文件到本地
export const makeDialogFile = ({ rootDir, characterList, dialogList, concurrency, onError, onSuccess }: {
  rootDir: FileSystemDir;
  characterList: Character[];
  dialogList: Dialog[];
  concurrency: number;
  onError?: (info: DownloadErrorInfo) => void;
  onSuccess?:  (dialog: Dialog) => void;
}) => {
  let canDownload = true;

  // 下载一句
  const downlowDialog = async (dialog: Dialog) => {
    const { char, label, text } = dialog;
    let charName2Id: Record<string, string> = {};
    characterList.forEach(c => charName2Id[c.name] = c.voiceId || 'xiaoyun');
    const voiceId = charName2Id[char] || 'xiaoyun';
    const result = await fetchTextVoice({ text, voiceId });
    if(result.success) {
      onSuccess && onSuccess(dialog);
      await rootDir.writeFile(`${label}.mp3`, result.data);
    } else {
      onError && onError({ dialog, error: result.data });
    };
  }

  // 并发池下载
  let i = 0;
  const pool = new PromisePool(() => {
    if(i < dialogList.length && canDownload) {
      const dialog = dialogList[i];
      i += 1;
      return downlowDialog(dialog);
    } else {
      return undefined;
    }
  }, concurrency);
  pool.start();

  // 返回的方法可以用来停止下载
  return {
    stopDownloading: () => canDownload = false,
  };
}