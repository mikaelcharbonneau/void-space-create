import { supabase } from "../db";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return res.status(400).json({ 
      success: false, 
      message: "Report ID is required" 
    });
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid report ID format"
    });
  }

  try {
    const { data, error } = await supabase
      .from('AuditReports')
      .select('*')
      .eq('Id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ 
          success: false, 
          message: "Report not found" 
        });
      }
      throw error;
    }
    
    return res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error(`Error generating report: ${error.message}`);
    return res.status(500).json({ 
      success: false, 
      message: `Error generating report: ${error.message}` 
    });
  }
}