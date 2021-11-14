import { useState } from 'react';
import { useModel } from 'umi';
import { Alert, Button, Radio } from 'antd';
import DownloadModal from './DownloadModal';

const MakeVoice: React.FC = () => {
  const { characterList } = useModel('configs');
  const noVoiceCharcterNum = characterList.filter(c => c.voiceId == null).length;
  
  // 并发数
  const [concurrency, setConcurrency] = useState(2);
  // 生成对话数
  const [isTryMake, setIsTryMake] = useState(true);

  // 下载状态模态框
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  return (
    <div className="flex justify-center">
      <div style={{ width: 800 }}>
        {
          noVoiceCharcterNum &&
          <Alert
            message="存在未指定配音的角色！"
            description={`当前还有${noVoiceCharcterNum}位角色没有配置音色，这些角色将使用旁白音效`}
            type="error"
          />
        }
        <Alert
          className="mt-4"
          message="请节约使用，不要反复生成大量对话！"
          description="阿里云语音合成接口的价格为每千句3.5元。20万字的剧本大约有1万句。生成全部配音文件将消耗大量接口配额并占用你的电脑资源。在生成全部配音文件前请先使用试听和生成前50句功能确保配置无误。"
          type="info"
        />
        
        <div className="mt-4 flex">
          <div className="text-xl">选择并发数：</div>
          <Radio.Group buttonStyle="solid" onChange={e => setConcurrency(e.target.value)} value={concurrency}>
            <Radio.Button value={2}>2路并发(阿里云tts免费版)</Radio.Button>
            <Radio.Button value={100}>100路并发(阿里云tts商业版)</Radio.Button>
          </Radio.Group>
        </div>

        <div className="mt-4 flex">
          <div className="text-xl" style={{ marginLeft: '1em' }}>生成数量：</div>
          <Radio.Group buttonStyle="solid" onChange={e => setIsTryMake(e.target.value)} value={isTryMake}>
            <Radio.Button value={true}>生成前50句(测试用)</Radio.Button>
            <Radio.Button value={false}>生成所有对话</Radio.Button>
          </Radio.Group>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            size="large"
            type="primary"
            onClick={() => {
              setShowDownloadModal(true);
            }}
          >
            开始生成
          </Button>
        </div>
      </div>

      {
        showDownloadModal &&
        <DownloadModal
          visiable={showDownloadModal}
          isTryMake={isTryMake}
          concurrency={concurrency}
          onCancle={() => setShowDownloadModal(false)}
        />
      }
    </div>
  );
};

export default MakeVoice;