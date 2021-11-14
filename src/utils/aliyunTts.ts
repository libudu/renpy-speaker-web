import axios from 'axios';

const appConfig = {
  appkey: 'RaY4l2CprZpngu4A',
  token: '6e7081f13fb24c16bf620c460f40fdce',
};

export interface AliVoiceProps {
  text: string;
  voiceId: string;
}

export const getTextVoiceUrl = ({ text, voiceId }: AliVoiceProps) => {
  const { appkey, token } = appConfig;
  text = encodeURIComponent(text);
  const params = `appkey=${appkey}&token=${token}&voice=${voiceId}&text=${text}`;
  const url = `/stream/v1/tts?${params}&format=mp3&sample_rate=16000`;
  return url;
};

const voiceCache: Record<string, HTMLAudioElement> = {};
let lastAudioEle: HTMLAudioElement | null = null;

export const playTextVoice = (dialog: AliVoiceProps) => {
  const url = getTextVoiceUrl(dialog);
  // 缓存节点
  const cacheVoice = voiceCache[url];
  let audioEle = cacheVoice || new Audio(url);
  if(!cacheVoice) {
    voiceCache[url] = audioEle;
  }
  // 上一个还在放的要暂停
  if(lastAudioEle && !lastAudioEle.ended) {
    lastAudioEle.pause();
    lastAudioEle.currentTime = 0;
    lastAudioEle = null;
  }
  // 这个开始播放
  audioEle.play();
  lastAudioEle = audioEle;
};

export const fetchTextVoice = async (dialog: AliVoiceProps): Promise<{ success: true, data: Blob } | { success: false, data: string }> => {
  const url = getTextVoiceUrl(dialog);
  return axios.get(url, { responseType: 'blob' })
    .then(res => {
      return {
        success: true,
        data: res.data,
      };
    })
    .catch(err => {
      const blob = err.response.data;
      const reader = new FileReader();
      reader.readAsText(blob);
      return new Promise(resolve => {
        reader.onload = res => {
          const text = res.target?.result as string;
          const obj = JSON.parse(text);
          resolve({
            success: false,
            data: obj.message,
          });
        }
      });
    });
};