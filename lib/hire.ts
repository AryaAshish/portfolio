import fs from 'fs'
import path from 'path'
import { HirePageContent } from '@/types'
import { db } from './db'

const hireFilePath = path.join(process.cwd(), 'content', 'hire.json')

export async function getHireContent(): Promise<HirePageContent> {
  const useSupabase = process.env.USE_SUPABASE === 'true'
  
  if (useSupabase) {
    try {
      const content = await db.content.get('hire')
      if (content) {
        return content as HirePageContent
      }
    } catch (error) {
      console.error('Error fetching hire content from Supabase:', error)
    }
  }

  if (!fs.existsSync(hireFilePath)) {
    return getDefaultHireContent()
  }

  try {
    const fileContents = fs.readFileSync(hireFilePath, 'utf8')
    return JSON.parse(fileContents) as HirePageContent
  } catch (error) {
    console.error('Error reading hire content:', error)
    return getDefaultHireContent()
  }
}

function getDefaultHireContent(): HirePageContent {
  return {
    hero: {
      title: "Engineer by craft.\nDiver by soul.\nRider by heart.",
      subtitle: "Android • Backend • Systems • Writing • Travel • Scuba • Motorcycles",
    },
    summary: {
      yearsOfExperience: 8,
      currentRole: "Senior Android Engineer",
      location: "Bengaluru, India",
      availability: "Open to new opportunities",
    },
    cta: {
      title: "Interested in working together?",
      description: "I'm open to senior engineering roles, especially in systems architecture, mobile platforms, and backend infrastructure.",
    },
    contact: {
      email: "thearyanashish09@gmail.com",
      phone: "+91-9549305633",
      location: "Bengaluru, India",
    },
    resumeUrl: "https://sxyfqzblgpqjhqxcomau.supabase.co/storage/v1/object/public/resumes/Ashish_Aryan_Resume.pdf",
  }
}

