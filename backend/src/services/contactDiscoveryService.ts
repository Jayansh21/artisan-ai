// backend/src/services/contactDiscoveryService.ts
export interface Contact {
  name: string;
  owner: string;
  phone: string;
  location: string;
  specialty: string;
  aiScore: number;
  reason: string;
  type?: string;
  compatibility?: number;
  contact?: string;
  bestTime?: string;
  language?: string;
  approach?: string;
}

export class ContactDiscoveryService {
  private mockContacts: Contact[] = [
    {
      name: "Sunita Boutique",
      owner: "Sunita Sharma", 
      phone: "+91-9876543210",
      location: "Rajpur Road, Dehradun",
      specialty: "Bridal wear",
      aiScore: 94,
      reason: "High customer rating, specializes in South Indian textiles"
    },
    {
      name: "Mountain Wedding Planners",
      owner: "Rajesh Thakur",
      phone: "+91-9876543211", 
      location: "Haridwar",
      specialty: "Destination weddings",
      aiScore: 88,
      reason: "Plans 200+ weddings annually, client base appreciates traditional wear"
    },
    {
      name: "Himalayan Textiles Hub",
      owner: "Mohan Rawat",
      phone: "+91-9876543212",
      location: "Mall Road, Dehradun", 
      specialty: "Premium textiles",
      aiScore: 96,
      reason: "Specializes in premium South Indian textiles, 15+ years experience"
    },
    {
      name: "Dev Bhoomi Distributors",
      owner: "Priya Bhatt",
      phone: "+91-9876543213",
      location: "Rishikesh",
      specialty: "Regional distribution", 
      aiScore: 89,
      reason: "Distributes to 50+ retailers across Uttarakhand hill stations"
    }
  ];

  async findContacts(region: string, type: string, product: string): Promise<Contact[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock contacts with enhanced data
    return this.mockContacts.map(contact => ({
      ...contact,
      type: type,
      compatibility: contact.aiScore,
      contact: contact.phone,
      bestTime: this.getRandomTime(),
      language: this.getRegionalLanguage(region),
      approach: this.getApproachStrategy(contact.specialty)
    }));
  }

  private getRandomTime(): string {
    const times = ["10-12 AM", "2-4 PM", "Evening 6-8 PM"];
    return times[Math.floor(Math.random() * times.length)];
  }

  private getRegionalLanguage(region: string): string {
    const languageMap: { [key: string]: string } = {
      'uttarakhand': 'Hindi, Garhwali',
      'punjab': 'Hindi, Punjabi',
      'gujarat': 'Hindi, Gujarati',
      'maharashtra': 'Hindi, Marathi'
    };
    return languageMap[region.toLowerCase()] || 'Hindi, English';
  }

  private getApproachStrategy(specialty: string): string {
    const strategies = [
      "Formal business proposal with heritage emphasis",
      "Volume partnership proposal", 
      "Cultural bridge storytelling",
      "Premium quality showcase"
    ];
    return strategies[Math.floor(Math.random() * strategies.length)];
  }
}