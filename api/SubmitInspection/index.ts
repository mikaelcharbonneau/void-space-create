import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from "../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  
  try {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).json({ success: true });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ 
        success: false, 
        message: 'Method not allowed' 
      });
    }

    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: 'Request body is required'
      });
    }

    const body = req.body;
    const { userEmail = "unknown", ...reportData } = body;
    
    const { data, error } = await supabase
      .from('AuditReports')
      .insert([
        { 
          UserEmail: userEmail,
          ReportData: reportData
        }
      ])
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to save inspection',
        error: error.message
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: "Inspection saved successfully",
      data: data?.[0]
    });
  } catch (error: any) {
    console.error('Error storing inspection:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An unexpected error occurred',
      error: error?.message || 'Unknown error'
    });
  }
}