export type TeamMember = {
  name: string;
  email: string;
  portrait?: string;
  linkedin?: string;
  instagram?: string;
};

type TeamGroup = {
  id: string;
  title: string;
  year: string;
  members: readonly TeamMember[];
};

export const teamGroups: readonly TeamGroup[] = [
  {
    id: "general-secretary",
    title: "General Secretary",
    year: "4th year",
    members: [
      { name: "Aaron George", email: "ag23ecb0f06@student.nitw.ac.in", portrait: "aaron-george" },
    ],
  },
  {
    id: "additional-secretaries",
    title: "Additional Secretaries",
    year: "4th year",
    members: [
      { name: "Akshara Bonam", email: "ab23ecb0a11@student.nitw.ac.in", portrait: "akshara-bonam" },
      { name: "Bompelli Srishanth Rao", email: "bs23ecb1a02@student.nitw.ac.in", portrait: "bompelli-srishanth-rao" },
      { name: "Gunachet Duggineni", email: "dg23ecb1a08@student.nitw.ac.in", portrait: "gunachet-duggineni" },
      { name: "Karri Mohan Naga Durga Dhaneswara Reddy", email: "km23ecb0a19@student.nitw.ac.in", portrait: "karri-dhaneswara-reddy" },
      { name: "Manvitha Reddy", email: "bs23ecb0b20@student.nitw.ac.in", portrait: "manvitha-reddy" },
      { name: "Mekala Varshitha", email: "mv23ecb0b12@student.nitw.ac.in", portrait: "mekala-varshitha" },
      { name: "Ramshetty Vineet", email: "rv23ecb0b28@student.nitw.ac.in", portrait: "ramshetty-vineet" },
      { name: "Shreeya Kosireddy", email: "sk23ecb0f24@student.nitw.ac.in", portrait: "shreeya-kosireddy" },
    ],
  },
  {
    id: "joint-secretaries",
    title: "Joint Secretaries",
    year: "3rd year",
    members: [
      { name: "Atifsha Syed", email: "as24ecb0a06@student.nitw.ac.in", portrait: "atifsha-syed" },
      { name: "Govind Ashish Srivatsav", email: "ga24ecb1a10@student.nitw.ac.in", portrait: "govind-ashish-srivatsav" },
      { name: "Gowri S", email: "gs24ecb0a22@student.nitw.ac.in", portrait: "gowri-s" },
      { name: "Jalluri Ajitesh", email: "ja24ecb0a25@student.nitw.ac.in", portrait: "jalluri-ajitesh" },
      { name: "Jogu Siddhartha Bixam", email: "js24ecb0a26@student.nitw.ac.in", portrait: "jogu-siddhartha-bixam" },
      { name: "Lipika Reddy Maram", email: "lr24ecb0b32@student.nitw.ac.in", portrait: "lipika-reddy-maram" },
      { name: "Numurs Sai Harini", email: "ns24ecb0a40@student.nitw.ac.in", portrait: "numurs-sai-harini" },
      { name: "Sarthak Salvi", email: "ss24ecb0b52@student.nitw.ac.in", portrait: "sarthak-salvi" },
      { name: "Tammali Pranitha", email: "tp24ecb0b58@student.nitw.ac.in", portrait: "tammali-pranitha" },
      { name: "Vamsikrishna Kadali", email: "vk24ecb0b62@student.nitw.ac.in", portrait: "vamsikrishna-kadali" },
      { name: "Vedika Gotur", email: "vg24ecb0a64@student.nitw.ac.in" },
      { name: "Vishwesh Abbireddi", email: "va24ecb0b66@student.nitw.ac.in", portrait: "vishwesh-abbireddi" },
    ],
  },
  {
    id: "executive-members",
    title: "Executive Members",
    year: "2nd year",
    members: [
      { name: "Aayush Deshpande", email: "aa25ecb1a41@student.nitw.ac.in", portrait: "aayush-deshpande" },
      { name: "Adwaid Raju", email: "ar25ecb0b42@student.nitw.ac.in", portrait: "adwaid-raju" },
      { name: "Alekh Kumar Roy", email: "ak25ecb0a70@student.nitw.ac.in", portrait: "alekh-kumar-roy" },
      { name: "Amy Sejal Tirkey", email: "as25ecb1a40@student.nitw.ac.in", portrait: "amy-sejal-tirkey" },
      { name: "Anish Sai Jaina", email: "as25ecb1a42@student.nitw.ac.in", portrait: "anish-sai-jaina" },
      { name: "Ashvanth Regan", email: "ar25ecb0b52@student.nitw.ac.in", portrait: "ashvanth-regan" },
      { name: "Daiwik Vipulkumar Khandheria", email: "dv25ecb0b61@student.nitw.ac.in", portrait: "daiwik-vipulkumar-khandheria" },
      { name: "Gaurav Beniwal", email: "gb25ecb1a04@student.nitw.ac.in", portrait: "gaurav-beniwal" },
      { name: "Girish Chinnaiya", email: "gc25ecb1a44@student.nitw.ac.in", portrait: "girish-chinnaiya" },
      { name: "Hasini Vollala", email: "vh25ecb1a20@student.nitw.ac.in", portrait: "hasini-vollala" },
      { name: "Krishnaprasath Balaraman", email: "kb25ecb1a50@student.nitw.ac.in", portrait: "krishnaprasath-balaraman" },
      { name: "Maneti Sankeerth", email: "ms25ecb0a45@student.nitw.ac.in", portrait: "maneti-sankeerth" },
      { name: "Nithilan Poonkundran", email: "np25ecb0b60@student.nitw.ac.in", portrait: "nithilan-poonkundran" },
      { name: "Nitin Char", email: "nn25ecb1a49@student.nitw.ac.in", portrait: "nitin-char" },
      { name: "Sai Sumukh Chekraraj", email: "cs25ecb0a06@student.nitw.ac.in", portrait: "sai-sumukh-chekraraj" },
      { name: "Segu Bhavyasai Sanjana", email: "sb25ecb1a47@student.nitw.ac.in", portrait: "segu-bhavyasai-sanjana" },
      { name: "Shrujan Muthyala Nagesh", email: "sm25ecb0a72@student.nitw.ac.in", portrait: "shrujan-muthyala-nagesh" },
      { name: "Srishti Roy", email: "sr25ecb0b72@student.nitw.ac.in", portrait: "srishti-roy" },
      { name: "T S A Hari Chandana", email: "ts25ecb1a10@student.nitw.ac.in", portrait: "t-s-a-hari-chandana" },
      { name: "Vidhi Jha", email: "vj25ecb1a54@student.nitw.ac.in", portrait: "vidhi-jha" },
      { name: "Zikra Siddiqui", email: "zs25ecb1a09@student.nitw.ac.in", portrait: "zikra-siddiqui" },
    ],
  },
];
