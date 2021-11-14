export const chooseDir = async () => {
  const dirHandler = await window.showDirectoryPicker();
  return new FileSystemDir(dirHandler);
};

export class FileSystemDir {
  constructor(public dir: FileSystemDirectoryHandle) {
  }

  getDirName() {
    return this.dir.name;
  }

  async writeFile(fileName: string, content: FileSystemWriteChunkType) {
    const fileHandler = await this.dir.getFileHandle(fileName, { create: true });
    const writeable = await fileHandler.createWritable();
    await writeable.write(content);
    await writeable.close();
    return true;
  }

  async getContentMap() {
    const contentList: Record<string, FileSystemHandle> = {};
    for await (const [key, value] of this.dir.entries()) {
      contentList[key] = value;
    }
    return contentList;
  }

  async readTextFile(fileName: string) {
    try {
      const fileHandler = await this.dir.getFileHandle(fileName);
      const file = await fileHandler.getFile();
      const text = await file.text();
      return text;
    } catch (e) {
      // 没有该文件
      return null;
    }
  }
}