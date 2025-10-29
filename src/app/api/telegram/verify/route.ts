import { NextRequest } from 'next/server';
import { verifyTelegramWebAppData } from '@/utils/telegramAuth';

export async function POST(request: NextRequest) {
  try {
    const { initData } = await request.json();
    
    if (!initData) {
      return Response.json(
        { error: 'Missing initData parameter' },
        { status: 400 }
      );
    }
    
    // 从环境变量获取 Telegram Bot Token
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
      return Response.json(
        { error: 'Telegram bot token not configured' },
        { status: 500 }
      );
    }
    
    // 验证 initData
    const isValid = verifyTelegramWebAppData(initData, botToken);
    
    if (isValid) {
      return Response.json({
        success: true,
        message: 'Telegram init data verified successfully'
      });
    } else {
      return Response.json(
        { error: 'Invalid Telegram init data' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error verifying Telegram init data:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}