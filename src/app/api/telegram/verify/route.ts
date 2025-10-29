import { NextRequest } from 'next/server';
import { verifyTelegramWebAppData } from '@/utils/telegramAuth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("收到Telegram验证请求，请求体:", body);
    
    const { initData } = body;
    
    if (!initData) {
      console.log("缺少initData参数");
      return Response.json(
        { error: '缺少initData参数' },
        { status: 400 }
      );
    }
    
    console.log("收到的initData:", initData);
    
    // 从环境变量获取 Telegram Bot Token
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    console.log("Telegram Bot Token配置状态:", !!botToken);
    
    if (!botToken) {
      console.log("未配置Telegram bot token");
      return Response.json(
        { error: '未配置Telegram bot token' },
        { status: 500 }
      );
    }
    
    // 验证 initData
    console.log("开始验证Telegram数据...");
    const isValid = verifyTelegramWebAppData(initData, botToken);
    console.log("Telegram数据验证结果:", isValid);
    
    if (isValid) {
      console.log("Telegram初始化数据验证成功");
      return Response.json({
        success: true,
        message: 'Telegram初始化数据验证成功'
      });
    } else {
      console.log("Telegram初始化数据验证失败");
      return Response.json(
        { error: '无效的Telegram初始化数据' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('验证Telegram初始化数据时出错:', error);
    // 返回更详细的错误信息
    return Response.json(
      { 
        error: '服务器内部错误',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}