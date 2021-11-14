import { playTextVoice } from '@/utils/aliyunTts';
import { Modal, Input, message } from 'antd';
import { useState } from 'react';

export const VOICE_TYPE = [
  {
      "name": "小云(标准女声)",
      "voiceId": "xiaoyun",
  },
  {
      "name": "小刚(标准男声)",
      "voiceId": "xiaogang",
  },
  {
      "name": "若兮(温柔女声)",
      "voiceId": "ruoxi",
  },
  {
      "name": "思琪(温柔女声)",
      "voiceId": "siqi",
  },
  {
      "name": "思佳(标准女声)",
      "voiceId": "sijia",
  },
  {
      "name": "思诚(标准男声)",
      "voiceId": "sicheng",
  },
  {
      "name": "艾琪(温柔女声)",
      "voiceId": "aiqi",
  },
  {
      "name": "艾佳(标准女声)",
      "voiceId": "aijia",
  },
  {
      "name": "艾诚(标准男声)",
      "voiceId": "aicheng",
  },
  {
      "name": "艾达(标准男声)",
      "voiceId": "aida",
  },
];

export const VoiceId2Name: Record<string, string> = {};
VOICE_TYPE.forEach(v => VoiceId2Name[v.voiceId] = v.name);

const DEFAULT_TRY_TEXT = '雪停了，侦探推开覆雪酒馆的大门。厚实的雪仍覆盖着石砖行道，侦探凭着记忆踏上来时的路。';

const VoiceModal: React.FC<{
  visible: boolean;
  onCancel: () => void;
  onChoose: (c: string) => void;
}> = ({ visible, onCancel, onChoose }) => {

  const [ tryText, setTryText ] = useState(DEFAULT_TRY_TEXT)

  return (
    <Modal
      title="选择配音"
      visible={visible}
      maskClosable
      onCancel={onCancel}
      footer={null}
    >
      <div className="flex mb-4  mx-2">
        <div className="whitespace-nowrap">试听文本</div>：
        <Input
          className="flex-grow"
          size="small"
          value={tryText}
          onChange={(e) => setTryText(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap">
        {
          VOICE_TYPE.map(({ name, voiceId }) => (
            <div key={voiceId} className="p-1 m-2" style={{ boxShadow: '0 0 4px #888', borderRadius: 4 }}>
              <div className="whitespace-nowrap">{ name }</div>
              <div className="flex justify-between px-2">
                <a onClick={() => {
                    if(!tryText) {
                      return message.error("试听文本为空，无法试听！");
                    }
                    return playTextVoice({ text: tryText, voiceId: voiceId, })
                  }}
                >
                  试听
                </a>
                <a onClick={() => onChoose(voiceId)}>
                  选择
                </a>
              </div>
            </div>
          ))
        }
      </div>
    </Modal>
  )
};

export default VoiceModal;