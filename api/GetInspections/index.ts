import { Request, Response } from 'express';
import { supabase } from "../db";

export const getInspections = async (req: Request, res: Response) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  try {
    const { data, error } = await supabase
      .from('AuditReports')
      .select('*')
      .order('Timestamp', { ascending: false })
      .limit(50);
    
    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    return res.status(200).json(data || []);
  } catch (error: any) {
    console.error('Error fetching inspections:', error);
    return res.status(500).json({ 
      success: false, 
      message: error?.message || 'An unexpected error occurred while fetching inspections'
    });
  }
};