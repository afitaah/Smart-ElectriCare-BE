import { Request, Response } from 'express';
import Notification from '../models/Notification';
import { ApiResponse, Notification as NotificationType } from '../types';
import { AuthRequest } from '../middleware/auth';
import { transformNotification, transformNotifications } from '../utils/transformers';

export const getAllNotifications = async (req: Request, res: Response<ApiResponse<NotificationType[]>>) => {
  try {
    const notifications = await Notification.find().sort({ timestamp: -1 });
    const transformedNotifications = transformNotifications(notifications as any);
    
    res.json({
      success: true,
      message: 'Notifications fetched successfully',
      data: transformedNotifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
};

export const getUnreadNotifications = async (req: Request, res: Response<ApiResponse<NotificationType[]>>) => {
  try {
    const notifications = await Notification.find({ isRead: false }).sort({ timestamp: -1 });
    const transformedNotifications = transformNotifications(notifications as any);
    
    res.json({
      success: true,
      message: 'Unread notifications fetched successfully',
      data: transformedNotifications
    });
  } catch (error) {
    console.error('Get unread notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread notifications'
    });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response<ApiResponse<void>>) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findOneAndUpdate(
      { id },
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
};

export const markAllNotificationsAsRead = async (req: Request, res: Response<ApiResponse<void>>) => {
  try {
    await Notification.updateMany({}, { isRead: true });
    
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
};

export const createNotification = async (req: AuthRequest, res: Response<ApiResponse<NotificationType>>) => {
  try {
    const notificationData = req.body;
    
    // Generate unique ID
    const count = await Notification.countDocuments();
    notificationData.id = `NOTIF${String(count + 1).padStart(4, '0')}`;
    
    const notification = new Notification(notificationData);
    await notification.save();
    
    const transformedNotification = transformNotification(notification as any);
    
    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: transformedNotification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification'
    });
  }
};
