import { CharacterList, DialogList } from './components/SpeakerItemList';
import { Tabs } from 'antd';
import MakeVoice from './components/MakeVoice';

export default function IndexPage() {
  return (
    <div className="p-4">
      <Tabs defaultActiveKey="1" centered>
        <Tabs.TabPane tab="角色列表" key="1">
          <CharacterList />
        </Tabs.TabPane>
        <Tabs.TabPane tab="对话列表" key="2">
          <DialogList />
        </Tabs.TabPane>
        <Tabs.TabPane tab="生成配音" key="3">
          <MakeVoice />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}
