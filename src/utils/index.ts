import { momentZh } from "./moment";

export function base64toFile(base64String: string, fileName: string) {
  const ary = base64String.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!ary) return;
  const [, fileType, base64Data] = ary;
  const byteCharacters = atob(base64Data); // 解码base64数据
  const byteNumbers = new Array(byteCharacters.length);

  // 将解码后的数据存储在数组中
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  // 创建一个Uint8Array，用于存储二进制数据
  const byteArray = new Uint8Array(byteNumbers);

  // 创建Blob对象，并将Uint8Array放入其中
  const blob = new Blob([byteArray], { type: fileType });

  // 创建File对象，将Blob对象放入其中
  return new File([blob], fileName, { type: fileType });
}

export function getGreeting() {
  const currentTime = momentZh();
  let greeting;
  const currentHour = currentTime.hours();
  if (currentHour >= 5 && currentHour < 9) {
    greeting = "早上好";
  } else if (currentHour >= 9 && currentHour < 12) {
    greeting = "上午好";
  } else if (currentHour >= 12 && currentHour < 14) {
    greeting = "中午好";
  } else if (currentHour >= 14 && currentHour < 18) {
    greeting = "下午好";
  } else if (currentHour >= 0 && currentHour < 5) {
    greeting = "晚上好，时间不早了，早点休息";
  } else {
    greeting = "晚上好";
  }
  return greeting;
}
