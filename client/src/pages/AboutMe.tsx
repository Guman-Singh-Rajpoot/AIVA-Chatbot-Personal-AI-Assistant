import { MainLayout } from "@/components/layout/MainLayout";
import { useState } from "react";
import { User, MapPin, Briefcase, Code2, Heart, Edit2, Save, X, Linkedin, Github, Mail, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

interface UserInfo {
  name: string;
  title: string;
  bio: string;
  whatIDo: string;
  techStack: string[];
  interests: string[];
  currently: string;
  experience: string;
  projectCount: string;
  projects: Project[];
  profileImage: string | null;
}

const defaultInfo: UserInfo = {
  name: "Guman Singh Rajpoot",
  title: "B.Tech Computer Science Student",
  bio: "Student at Sitare University with SRMU, Lucknow. Passionate about full-stack development, AI/ML, and building scalable web solutions. 100% B.Tech CS Scholarship recipient.",
  whatIDo: "I build full-stack web applications combining frontend and backend technologies. I've developed property discovery platforms, real-time analytics dashboards, and mathematical computing tools. I focus on creating user-centric solutions that solve real-world problems efficiently.",
  techStack: ["Python", "JavaScript", "TypeScript", "Java", "React", "Node.js", "FastAPI", "REST APIs", "HTML/CSS", "MySQL", "PostgreSQL", "Pandas", "NumPy", "Git", "GitHub", "Tailwind CSS"],
  interests: ["Full-stack web development", "Artificial Intelligence and Machine Learning", "Data Structures & Algorithms", "Database Design", "REST API Architecture", "Real-time analytics"],
  currently: "Completing B.Tech in Computer Science (Expected May'27). Currently building web applications including HomeFinder (property discovery platform), LeetCode Progress Tracker (full-stack analytics), and LDU Factorization tool. Always learning new technologies and contributing to projects.",
  experience: "Student",
  projectCount: "3",
  projects: [
    { id: "1", name: "HomeFinder", description: "Property discovery platform helping users find the best property deals based on location and budget.", technologies: "HTML, CSS, JavaScript, REST APIs, Python" , link: "https://github.com/Guman-Singh-Rajpoot" },
    { id: "2", name: "LeetCode Progress Tracker", description: "Full-stack analytics dashboard tracking coding progress with real-time sync and insights.", technologies: "React, TypeScript, Node.js, PostgreSQL, Tailwind CSS", link: "https://github.com/Guman-Singh-Rajpoot" },
    { id: "3", name: "LDU Factorization", description: "Mathematical tool for LDU matrix factorization with step-by-step results.", technologies: "HTML, CSS, JavaScript", link: "https://github.com/Guman-Singh-Rajpoot" },
  ],
  profileImage: null,
};

export default function AboutMe() {
  const [isEditing, setIsEditing] = useState(false);
  const [info, setInfo] = useState<UserInfo>(defaultInfo);
  const [formData, setFormData] = useState<UserInfo>(info);

  const handleEdit = () => {
    setFormData(info);
    setIsEditing(true);
  };

  const handleSave = () => {
    setInfo(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserInfo, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTechStackChange = (index: number, value: string) => {
    const newStack = [...formData.techStack];
    newStack[index] = value;
    setFormData(prev => ({ ...prev, techStack: newStack }));
  };

  const addTechStack = () => {
    setFormData(prev => ({ ...prev, techStack: [...prev.techStack, ""] }));
  };

  const removeTechStack = (index: number) => {
    setFormData(prev => ({ ...prev, techStack: prev.techStack.filter((_, i) => i !== index) }));
  };

  const handleInterestChange = (index: number, value: string) => {
    const newInterests = [...formData.interests];
    newInterests[index] = value;
    setFormData(prev => ({ ...prev, interests: newInterests }));
  };

  const addInterest = () => {
    setFormData(prev => ({ ...prev, interests: [...prev.interests, ""] }));
  };

  const removeInterest = (index: number) => {
    setFormData(prev => ({ ...prev, interests: prev.interests.filter((_, i) => i !== index) }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setFormData(prev => ({ ...prev, profileImage: imageData }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, profileImage: null }));
  };

  const addProject = () => {
    const newProject: Project = { id: Date.now().toString(), name: "", description: "", technologies: "", link: "" };
    setFormData(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const removeProject = (id: string) => {
    setFormData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  if (isEditing) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-display font-bold">Edit Profile</h1>
            <div className="flex gap-2">
              <Button onClick={handleCancel} variant="outline">
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold">Profile Photo</h2>
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden shadow-lg">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-white" />
                )}
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Upload Photo</label>
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-white hover:file:bg-primary/90"
                  />
                </div>
                {formData.profileImage && (
                  <Button onClick={removePhoto} variant="outline" size="sm" className="text-destructive">
                    <X className="h-4 w-4 mr-2" /> Remove Photo
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold">Basic Info</h2>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
              <Input 
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-background/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Title</label>
              <Input 
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="bg-background/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Bio</label>
              <Textarea 
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="bg-background/50 min-h-24"
              />
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold">What I Do</h2>
            <Textarea 
              value={formData.whatIDo}
              onChange={(e) => handleInputChange('whatIDo', e.target.value)}
              className="bg-background/50 min-h-24"
            />
          </div>

          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-lg font-semibold">Tech Stack</h2>
              <Button onClick={addTechStack} variant="outline" size="sm">+ Add</Button>
            </div>
            <div className="space-y-2">
              {formData.techStack.map((tech, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    value={tech}
                    onChange={(e) => handleTechStackChange(index, e.target.value)}
                    placeholder="Technology name"
                    className="bg-background/50"
                  />
                  <Button onClick={() => removeTechStack(index)} variant="outline" size="icon" className="text-destructive">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-lg font-semibold">Interests & Passions</h2>
              <Button onClick={addInterest} variant="outline" size="sm">+ Add</Button>
            </div>
            <div className="space-y-2">
              {formData.interests.map((interest, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    value={interest}
                    onChange={(e) => handleInterestChange(index, e.target.value)}
                    placeholder="Your interest"
                    className="bg-background/50"
                  />
                  <Button onClick={() => removeInterest(index)} variant="outline" size="icon" className="text-destructive">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold">Currently Working On</h2>
            <Textarea 
              value={formData.currently}
              onChange={(e) => handleInputChange('currently', e.target.value)}
              className="bg-background/50 min-h-20"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Years of Experience</label>
              <Input 
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className="bg-background/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Projects Completed</label>
              <Input 
                value={formData.projectCount}
                onChange={(e) => handleInputChange('projectCount', e.target.value)}
                className="bg-background/50"
              />
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-lg font-semibold">Your Projects</h2>
              <Button onClick={addProject} variant="outline" size="sm">+ Add Project</Button>
            </div>
            <div className="space-y-4">
              {formData.projects.map((project) => (
                <div key={project.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Project Name</label>
                    <Input 
                      value={project.name}
                      onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                      placeholder="e.g., HomeFinder"
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
                    <Textarea 
                      value={project.description}
                      onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                      placeholder="Brief description of your project"
                      className="bg-background/50 min-h-16"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Technologies Used</label>
                    <Input 
                      value={project.technologies}
                      onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                      placeholder="e.g., React, Node.js, PostgreSQL"
                      className="bg-background/50"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-foreground mb-1 block">Project Link</label>
                      <Input 
                        value={project.link}
                        onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                        placeholder="https://github.com/..."
                        className="bg-background/50"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={() => removeProject(project.id)} variant="outline" size="icon" className="text-destructive">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="glass-card rounded-xl p-8 text-center relative">
          <div className="absolute top-4 right-4">
            <Button onClick={handleEdit} className="gap-2 bg-primary hover:bg-primary/90">
              <Edit2 className="h-4 w-4" /> Edit Profile
            </Button>
          </div>
          
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
            {info.profileImage ? (
              <img src={info.profileImage} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User className="h-12 w-12 text-white" />
            )}
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">{info.name}</h1>
          <p className="text-lg text-primary font-medium mb-4">{info.title}</p>
          <p className="text-muted-foreground text-base leading-relaxed mb-6">
            {info.bio}
          </p>
          
          <div className="flex justify-center gap-3 flex-wrap">
            <a href="https://www.linkedin.com/in/guman-singh-06a082324/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0077B5]/10 hover:bg-[#0077B5]/20 text-[#0077B5] transition-colors">
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
            <a href="https://github.com/Guman-Singh-Rajpoot" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-500/10 hover:bg-gray-500/20 text-gray-300 transition-colors">
              <Github className="h-4 w-4" /> GitHub
            </a>
            <a href="tel:+919026683599" className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 hover:bg-green-500/20 text-green-500 transition-colors">
              <Phone className="h-4 w-4" /> +91 90266 83599
            </a>
            <a href="mailto:su-24051@sitare.org" className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
              <Mail className="h-4 w-4" /> Email
            </a>
          </div>
        </div>

        {/* About Section */}
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <Briefcase className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">What I Do</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {info.whatIDo}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <Code2 className="h-6 w-6 text-secondary shrink-0 mt-1" />
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {info.techStack.filter(t => t.trim()).map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <Heart className="h-6 w-6 text-red-500 shrink-0 mt-1" />
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">Interests & Passions</h3>
                <ul className="space-y-2 text-muted-foreground">
                  {info.interests.filter(i => i.trim()).map((interest, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                      {interest}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <MapPin className="h-6 w-6 text-accent shrink-0 mt-1" />
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">Currently</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {info.currently}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="glass-card rounded-lg p-6 text-center">
            <div className="text-3xl font-display font-bold text-primary mb-1">{info.experience}</div>
            <p className="text-muted-foreground text-sm">Years of Experience</p>
          </div>
          <div className="glass-card rounded-lg p-6 text-center">
            <div className="text-3xl font-display font-bold text-secondary mb-1">{info.projectCount}</div>
            <p className="text-muted-foreground text-sm">Projects Completed</p>
          </div>
          <div className="glass-card rounded-lg p-6 text-center">
            <div className="text-3xl font-display font-bold text-accent mb-1">100%</div>
            <p className="text-muted-foreground text-sm">Commitment</p>
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {info.projects.filter(p => p.name.trim()).map((project) => (
              <div key={project.id} className="glass-card rounded-xl p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-display font-bold text-lg text-foreground">{project.name}</h3>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.split(',').map((tech, i) => (
                      <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
