import { useState } from 'react';
import { useModel } from "umi";
import { Button, message, Table } from "antd";
import VoiceModal, { VoiceId2Name } from './VoiceModal';
import { playTextVoice } from '@/utils/aliyunTts';
import { Dialog } from '@/utils/speakerFile';

export interface CharacterListProps {
  charList: {
    name: string;
    voice: string | null;
  }[];
};

const BaseList: React.FC<{
  columns: {
    title: string;
    dataIndex: string,
    width?: number;
    render?: (text: any, record: any) => any
  }[],
  dataSource: any[],
}> = ({ columns, dataSource }) => {
  return (
    <div className="flex justify-center">
      <Table
        style={{ minWidth: 600, maxWidth: 1000 }}
        size="small"
        columns={columns.map(col => ({ ...col, key: col.dataIndex }))}
        dataSource={dataSource}
      />
    </div>
  )
}

export const CharacterList: React.FC = () => {
  const { characterList, setCharacterList } = useModel('configs');
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [modalCharacter, setModalCharacter] = useState<string | null>(null);
  
  return (
    <>
      <BaseList
        dataSource={characterList}
        columns={[
          {
            title: '角色名称',
            dataIndex: 'name',
          },
          {
            title: '指定语音',
            dataIndex: 'voiceId',
            render: (v) => (v  && VoiceId2Name[v]) || <div className="text-red-400">暂未指定</div>,
          },
          {
            title: '操作',
            dataIndex: 'name',
            render: (name: string) => (
              <Button
                type="primary"
                onClick={() => {
                  setModalCharacter(name);
                  setShowVoiceModal(true);
                }}
              >
                指定配音
              </Button>
            ),
          }
        ]}
      />
      <VoiceModal
        visible={showVoiceModal}
        onCancel={() => setShowVoiceModal(false)}
        onChoose={(voiceId) => {
          const selectCharacter = characterList.find(c => c.name == modalCharacter)
          if(selectCharacter) {
            selectCharacter.voiceId = voiceId;
            setCharacterList([ ...characterList ]);
            setShowVoiceModal(false);
          }
        }
        }
      />
    </>
  );
};

export const DialogList: React.FC = () => {
  const { dialogList, characterList } = useModel('configs');
  return (
    <BaseList
      dataSource={dialogList.map(i => ({ ...i, key: i.label }))}
      columns={[
        {
          title: '标签',
          dataIndex: 'label',
        },
        {
          title: '角色',
          dataIndex: 'char',
        },
        {
          title: '声音',
          dataIndex: 'voiceId',
          width: 110,
          render: (_, record: Dialog) => {
            const characterName = record.char;
            const voiceId = characterList.find(c => c.name == characterName)?.voiceId;
            return voiceId ? VoiceId2Name[voiceId] : <div className="text-red-400">暂未指定</div>;
          },
        },
        {
          title: '文本',
          dataIndex: 'text',
        },
        {
          title: '操作',
          dataIndex: 'label',
          render: (_, record: Dialog) => {
            return (
              <Button
                type="primary"
                onClick={() => {
                  const characterName = record.char;
                  const voiceId = characterList.find(c => c.name == characterName)?.voiceId || 'xiaoyun';
                  if(voiceId) {
                    playTextVoice({ text: record.text, voiceId });
                  }
                }}>
                试听
              </Button>
            )  
          }
        },
      ]}
    />
  );
};