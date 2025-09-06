// frontend/src/components/networking/SmartNetworking.tsx
import React, { useState, useEffect } from 'react';
import { Users, MapPin, Phone, Star, Clock, MessageSquare, Search, Filter, Send, Mail, ExternalLink } from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  owner: string;
  phone: string;
  email?: string;
  location: string;
  specialty: string;
  aiScore: number;
  reason: string;
  type: 'retailer' | 'wholesaler' | 'distributor' | 'wedding-planner' | 'influencer';
  compatibility?: number;
  bestTime?: string;
  language?: string;
  approach?: string;
  lastContact?: string;
  status: 'new' | 'contacted' | 'responded' | 'meeting-scheduled' | 'partner';
}

interface CommunicationTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
  type: 'introduction' | 'follow-up' | 'partnership' | 'product-showcase';
  language: 'english' | 'hindi' | 'regional';
}

const SmartNetworking: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discovery' | 'contacts' | 'templates' | 'communication'>('discovery');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<CommunicationTemplate | null>(null);

  useEffect(() => {
    fetchNetworkingData();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [searchQuery, selectedRegion, selectedType, contacts]);

  const fetchNetworkingData = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setContacts([
        {
          id: 1,
          name: "Sunita Boutique",
          owner: "Sunita Sharma",
          phone: "+91-9876543210",
          email: "sunita@sunitaboutique.com",
          location: "Rajpur Road, Dehradun",
          specialty: "Bridal wear & South Indian textiles",
          aiScore: 94,
          reason: "High customer rating, specializes in South Indian textiles, 150+ wedding orders annually",
          type: "retailer",
          compatibility: 94,
          bestTime: "10-12 AM",
          language: "Hindi, English",
          approach: "Cultural heritage storytelling with quality emphasis",
          status: "new"
        },
        {
          id: 2,
          name: "Mountain Wedding Planners",
          owner: "Rajesh Thakur",
          phone: "+91-9876543211",
          email: "rajesh@mountainweddings.com",
          location: "Haridwar, Uttarakhand",
          specialty: "Destination weddings & event planning",
          aiScore: 88,
          reason: "Plans 200+ weddings annually, client base appreciates traditional wear",
          type: "wedding-planner",
          compatibility: 88,
          bestTime: "2-4 PM",
          language: "Hindi, English, Garhwali",
          approach: "Partnership proposal with exclusive collection showcase",
          status: "contacted"
        },
        {
          id: 3,
          name: "Himalayan Textiles Hub",
          owner: "Mohan Rawat",
          phone: "+91-9876543212",
          email: "mohan@himalayantextiles.com",
          location: "Mall Road, Dehradun",
          specialty: "Premium textiles & wholesale distribution",
          aiScore: 96,
          reason: "Largest textile distributor in region, 15+ years experience, 50+ retail network",
          type: "distributor",
          compatibility: 96,
          bestTime: "Evening 6-8 PM",
          language: "Hindi, English, Punjabi",
          approach: "Volume partnership with regional exclusivity",
          status: "responded"
        },
        {
          id: 4,
          name: "Dev Bhoomi Distributors",
          owner: "Priya Bhatt",
          phone: "+91-9876543213",
          email: "priya@devbhoomidist.com",
          location: "Rishikesh, Uttarakhand",
          specialty: "Regional distribution & retail partnerships",
          aiScore: 89,
          reason: "Distributes to 50+ retailers across Uttarakhand hill stations",
          type: "distributor",
          compatibility: 89,
          bestTime: "10-12 AM",
          language: "Hindi, Garhwali",
          approach: "Regional partnership with festival collection focus",
          status: "meeting-scheduled"
        },
        {
          id: 5,
          name: "Cultural Heritage Blogger",
          owner: "Ananya Joshi",
          phone: "+91-9876543214",
          email: "ananya@heritagetrends.com",
          location: "Mussoorie, Uttarakhand",
          specialty: "Cultural fashion & lifestyle content",
          aiScore: 82,
          reason: "50K+ followers interested in traditional fashion, high engagement rate",
          type: "influencer",
          compatibility: 82,
          bestTime: "Evening 7-9 PM",
          language: "Hindi, English",
          approach: "Collaboration for authentic cultural storytelling",
          status: "new"
        }
      ]);

      setTemplates([
        {
          id: 1,
          name: "Cultural Introduction",
          subject: "Bringing South Indian Heritage to {Region} - Partnership Opportunity",
          content: `Namaste {OwnerName},

I hope this message finds you well. I am {YourName} from {YourBusiness}, and I specialize in authentic South Indian textiles, particularly {YourSpecialty}.

I've been researching the {Region} market and was impressed by {BusinessName}'s reputation for quality and customer service. Our handcrafted pieces blend traditional artistry with contemporary appeal - something I believe would resonate strongly with your clientele.

Our collection includes:
- Authentic Kanchipuram silk sarees
- Temple jewelry crafted by traditional artisans  
- Regional fusion designs that honor local preferences

I would love to discuss how we can introduce these heritage pieces to your customers while respecting and celebrating {Region}'s unique cultural aesthetics.

Would you be available for a brief conversation this week? I'm confident we can create something beautiful together.

Warm regards,
{YourName}
{YourContact}`,
          type: "introduction",
          language: "english"
        },
        {
          id: 2,
          name: "Hindi Introduction",
          subject: "दक्षिण भारतीय पारंपरिक वस्त्र - साझेदारी का प्रस्ताव",
          content: `नमस्कार {OwnerName} जी,

मैं {YourName} हूं और दक्षिण भारतीय पारंपरिक वस्त्रों का व्यवसाय करता हूं। आपकी दुकान {BusinessName} की {Region} में बहुत अच्छी प्रतिष्ठा है।

हमारे पास हैं:
- शुद्ध काञ्चीपुरम सिल्क साड़ियां
- हस्तनिर्मित मंदिर के आभूषण
- पारंपरिक और आधुनिक डिजाइन का मिश्रण

क्या हम एक बार मिलकर बात कर सकते हैं? मुझे लगता है कि आपके ग्राहकों को हमारे उत्पाद बहुत पसंद आएंगे।

आपका शुभचिंतक,
{YourName}
{YourContact}`,
          type: "introduction",
          language: "hindi"
        },
        {
          id: 3,
          name: "Follow-up Message",
          subject: "Following up on our heritage textile discussion",
          content: `Dear {OwnerName},

I hope you're doing well. I wanted to follow up on my previous message regarding our South Indian textile collection.

I understand you're busy, especially during the current season. I wanted to share that we've recently received some stunning new pieces that I think would be perfect for your store:

- Limited edition bridal collection with {Region}-inspired motifs
- Lightweight silk sarees perfect for the local climate
- Matching jewelry sets crafted by award-winning artisans

I'm happy to arrange a private viewing at your convenience, or I can send some samples for you to examine. Many retailers in {Region} have seen 30-40% higher margins with our authentic pieces.

Would next week work better for a brief call?

Best regards,
{YourName}`,
          type: "follow-up",
          language: "english"
        },
        {
          id: 4,
          name: "Partnership Proposal",
          subject: "Exclusive Partnership Opportunity - {Region} Market",
          content: `Dear {OwnerName},

After our recent conversation, I'm excited to propose a formal partnership between {YourBusiness} and {BusinessName}.

Partnership Benefits:
✓ Exclusive territory rights for {Region}
✓ 25% higher margins than typical textile products  
✓ Complete marketing support and training
✓ Flexible inventory with no minimum orders initially
✓ Cultural adaptation of designs for local preferences

Investment Required: Minimal - we provide initial inventory on consignment
Timeline: Partnership can begin within 2 weeks
Support Provided: Training, marketing materials, and ongoing consultation

Our success stories include:
- 40% increase in premium sales for partners
- Average customer return rate of 65%
- Strong word-of-mouth marketing from satisfied customers

I'd love to schedule a detailed discussion about terms and next steps. Are you available this week for a call?

Looking forward to building something special together.

Warm regards,
{YourName}
{YourContact}`,
          type: "partnership",
          language: "english"
        }
      ]);

      setLoading(false);
    }, 1500);
  };

  const filterContacts = () => {
    let filtered = contacts;

    if (searchQuery) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(contact =>
        contact.location.toLowerCase().includes(selectedRegion.toLowerCase())
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(contact => contact.type === selectedType);
    }

    setFilteredContacts(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'contacted':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'responded':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'meeting-scheduled':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'partner':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'retailer':
        return '🏪';
      case 'wholesaler':
        return '📦';
      case 'distributor':
        return '🚛';
      case 'wedding-planner':
        return '💒';
      case 'influencer':
        return '📱';
      default:
        return '👥';
    }
  };

  const updateContactStatus = (contactId: number, newStatus: Contact['status']) => {
    setContacts(prev =>
      prev.map(contact =>
        contact.id === contactId ? { ...contact, status: newStatus } : contact
      )
    );
  };

  const sendMessage = (contact: Contact, template: CommunicationTemplate) => {
    // Simulate sending message
    updateContactStatus(contact.id, 'contacted');
    alert(`Message sent to ${contact.owner} using template "${template.name}"`);
  };

  const renderDiscovery = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">AI Contact Discovery</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Find New Contacts
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Regions</option>
            <option value="uttarakhand">Uttarakhand</option>
            <option value="punjab">Punjab</option>
            <option value="gujarat">Gujarat</option>
            <option value="maharashtra">Maharashtra</option>
          </select>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="retailer">Retailers</option>
            <option value="wholesaler">Wholesalers</option>
            <option value="distributor">Distributors</option>
            <option value="wedding-planner">Wedding Planners</option>
            <option value="influencer">Influencers</option>
          </select>
          
          <button className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </button>
        </div>
      </div>

      {/* Contact Results */}
      <div className="grid gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Finding relevant contacts...</span>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div key={contact.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{getTypeIcon(contact.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-xl font-semibold text-gray-800">{contact.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(contact.status)}`}>
                        {contact.status.replace('-', ' ')}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-2">Owner: {contact.owner}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {contact.location}
                        </p>
                        <p className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {contact.phone}
                        </p>
                        {contact.email && (
                          <p className="flex items-center text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            {contact.email}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600">
                          <span className="font-medium">Specialty:</span> {contact.specialty}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Best Time:</span> {contact.bestTime}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Languages:</span> {contact.language}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-800">AI Match Score: {contact.aiScore}%</span>
                      </div>
                      <p className="text-blue-700 text-sm">{contact.reason}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Recommended Approach:</span> {contact.approach}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center justify-end space-x-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold text-lg">{contact.compatibility}%</span>
                  </div>
                  <p className="text-xs text-gray-500">Compatibility</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setSelectedContact(contact)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderContacts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">My Network</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Total Contacts: {contacts.length}</span>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export Contacts
          </button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { status: 'new', count: contacts.filter(c => c.status === 'new').length, label: 'New Leads', color: 'blue' },
          { status: 'contacted', count: contacts.filter(c => c.status === 'contacted').length, label: 'Contacted', color: 'yellow' },
          { status: 'responded', count: contacts.filter(c => c.status === 'responded').length, label: 'Responded', color: 'green' },
          { status: 'meeting-scheduled', count: contacts.filter(c => c.status === 'meeting-scheduled').length, label: 'Meetings', color: 'purple' },
          { status: 'partner', count: contacts.filter(c => c.status === 'partner').length, label: 'Partners', color: 'emerald' }
        ].map((item) => (
          <div key={item.status} className={`bg-${item.color}-50 rounded-lg p-4 border border-${item.color}-200`}>
            <p className={`text-2xl font-bold text-${item.color}-600`}>{item.count}</p>
            <p className={`text-sm text-${item.color}-700`}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* Contact Management Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="font-semibold text-gray-800">Contact Management</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.owner}</p>
                      <p className="text-sm text-gray-500">{contact.location}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="mr-2">{getTypeIcon(contact.type)}</span>
                      <span className="capitalize">{contact.type.replace('-', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={contact.status}
                      onChange={(e) => updateContactStatus(contact.id, e.target.value as Contact['status'])}
                      className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(contact.status)}`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="responded">Responded</option>
                      <option value="meeting-scheduled">Meeting Scheduled</option>
                      <option value="partner">Partner</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{contact.aiScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setSelectedContact(contact)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Communication Templates</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Create New Template
        </button>
      </div>

      <div className="grid gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-1">{template.name}</h4>
                <p className="text-sm text-gray-600 mb-2">Subject: {template.subject}</p>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    template.type === 'introduction' ? 'bg-blue-100 text-blue-800' :
                    template.type === 'follow-up' ? 'bg-yellow-100 text-yellow-800' :
                    template.type === 'partnership' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {template.type.replace('-', ' ')}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    template.language === 'english' ? 'bg-gray-100 text-gray-800' :
                    template.language === 'hindi' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {template.language}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedTemplate(template)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Use Template
                </button>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  Edit
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                {template.content}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCommunication = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Send Message</h3>
      
      {selectedContact && selectedTemplate ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                Message to {selectedContact.owner} ({selectedContact.name})
              </h4>
              <p className="text-sm text-gray-600">Using template: {selectedTemplate.name}</p>
            </div>
            <button
              onClick={() => { setSelectedContact(null); setSelectedTemplate(null); }}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To:</label>
              <input
                type="email"
                value={selectedContact.email || selectedContact.phone}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject:</label>
              <input
                type="text"
                value={selectedTemplate.subject.replace('{Region}', selectedContact.location.split(',')[1]?.trim() || 'your region')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message:</label>
              <textarea
                rows={12}
                value={selectedTemplate.content
                  .replace('{OwnerName}', selectedContact.owner)
                  .replace('{BusinessName}', selectedContact.name)
                  .replace(/{Region}/g, selectedContact.location.split(',')[1]?.trim() || 'your region')
                  .replace('{YourName}', '[Your Name]')
                  .replace('{YourBusiness}', '[Your Business Name]')
                  .replace('{YourSpecialty}', '[Your Product Specialty]')
                  .replace('{YourContact}', '[Your Contact Information]')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => sendMessage(selectedContact, selectedTemplate)}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
              
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Save as Draft
              </button>
              
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Schedule Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Ready to Connect</h4>
          <p className="text-gray-600 mb-4">
            Select a contact from the Discovery or Contacts tab, then choose a template to start communicating.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setActiveTab('discovery')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Find Contacts
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              View Templates
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Smart Networking</h2>
        <p className="text-gray-600">AI-powered contact discovery and relationship management</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        {[
          { key: 'discovery', label: 'Contact Discovery', icon: Search },
          { key: 'contacts', label: 'My Network', icon: Users },
          { key: 'templates', label: 'Templates', icon: MessageSquare },
          { key: 'communication', label: 'Send Messages', icon: Send }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === 'discovery' && renderDiscovery()}
        {activeTab === 'contacts' && renderContacts()}
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'communication' && renderCommunication()}
      </div>
    </div>
  );
};

export default SmartNetworking;