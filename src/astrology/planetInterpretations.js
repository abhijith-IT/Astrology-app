// Planet Interpretations Engine
  function calculateStrength(planet) {
    // Mock strength calculation based on element matching or dignity
    // For simplicity in UI, we'll assign a value between 40 and 95
    // based on a deterministic hash of its longitude so it stays consistent.
    const seed = Math.abs(Math.sin(planet.longitude)) * 100;
    return Math.floor(40 + (seed % 55));
  }

export function getPlanetInterpretation(planet) {
    const signName = planet.sign.name;
    const element = planet.sign.element;
    const house = planet.house;
    
    let coreMeaning = "";
    let personalityInfluence = "";
    let careerInfluence = "";
    let loveInfluence = "";
    let healthInfluence = "";
    let practicalAdvice = "";

    switch(planet.name) {
      case "Sun":
        coreMeaning = "The core self, ego, and life purpose.";
        personalityInfluence = `You express yourself with ${signName}'s ${element.toLowerCase()} energy.`;
        careerInfluence = `In the ${house}th house, your natural authority shines in this area of life.`;
        loveInfluence = `You seek partners who respect your need to shine.`;
        healthInfluence = `Vitality is tied to your heart and spine; keep your passion alive.`;
        practicalAdvice = `Don't be afraid to take up space and lead where you are naturally gifted.`;
        break;
      case "Moon":
        coreMeaning = "Emotions, intuition, and subconscious needs.";
        personalityInfluence = `Your emotional security relies on ${signName}'s qualities.`;
        careerInfluence = `You need a career that feels nurturing or emotionally resonant.`;
        loveInfluence = `Deep emotional connection is your primary requirement.`;
        healthInfluence = `Stress affects your digestion; prioritize emotional boundaries.`;
        practicalAdvice = `Listen to your gut feelings—they are highly accurate for you.`;
        break;
      case "Mercury":
        coreMeaning = "Communication, intellect, and processing.";
        personalityInfluence = `You think and speak with a ${signName} filter.`;
        careerInfluence = `Analytical and communication skills are your strongest assets.`;
        loveInfluence = `Mental stimulation is a prerequisite for attraction.`;
        healthInfluence = `Nervous energy needs an outlet—try journaling or walking.`;
        practicalAdvice = `Write down your ideas; your mind moves faster than you realize.`;
        break;
      case "Venus":
        coreMeaning = "Love, beauty, values, and attraction.";
        personalityInfluence = `You charm others through ${signName}-like grace.`;
        careerInfluence = `Aesthetic or harmonious environments are essential for your work.`;
        loveInfluence = `You express love and desire affection through ${element.toLowerCase()} love languages.`;
        healthInfluence = `Indulgence is your weakness; balance pleasure with discipline.`;
        practicalAdvice = `Invest in your surroundings to boost your daily mood.`;
        break;
      case "Mars":
        coreMeaning = "Action, drive, courage, and conflict.";
        personalityInfluence = `You assert yourself using the traits of ${signName}.`;
        careerInfluence = `You thrive in competitive or pioneering roles.`;
        loveInfluence = `Passion and physical connection drive your romantic life.`;
        healthInfluence = `Burnout is a risk; regular vigorous exercise is vital.`;
        practicalAdvice = `Pick your battles wisely, but don't suppress your drive.`;
        break;
      case "Jupiter":
        coreMeaning = "Expansion, luck, philosophy, and growth.";
        personalityInfluence = `You find optimism and growth through ${signName} themes.`;
        careerInfluence = `Teaching, travel, or broad vision brings professional success.`;
        loveInfluence = `You desire a partner who expands your worldview.`;
        healthInfluence = `Beware of excess; moderation is your lifelong lesson.`;
        practicalAdvice = `Say 'yes' to opportunities that scare you just a little bit.`;
        break;
      case "Saturn":
        coreMeaning = "Discipline, karma, responsibility, and structure.";
        personalityInfluence = `You face your greatest fears and build lasting structures via ${signName}.`;
        careerInfluence = `Success comes late but lasts long through steady effort.`;
        loveInfluence = `You take commitments very seriously and expect the same.`;
        healthInfluence = `Joints and bones need care; maintain a steady physical routine.`;
        practicalAdvice = `Embrace the grind. Shortcuts will always backfire for you.`;
        break;
      case "Uranus":
        coreMeaning = "Rebellion, innovation, and sudden changes.";
        personalityInfluence = `Your unique, eccentric side expresses itself through ${signName}.`;
        careerInfluence = `You need autonomy and disdain micromanagement.`;
        loveInfluence = `Conventional relationships feel stifling; you need space.`;
        healthInfluence = `Sudden nervous tension requires grounding practices.`;
        practicalAdvice = `Lean into your weirdness—it is your genius.`;
        break;
      case "Neptune":
        coreMeaning = "Dreams, illusion, spirituality, and art.";
        personalityInfluence = `You are highly sensitive and absorb ${signName} energies easily.`;
        careerInfluence = `Creative, healing, or behind-the-scenes work suits you best.`;
        loveInfluence = `You seek a soulmate but must beware of wearing rose-colored glasses.`;
        healthInfluence = `You are highly sensitive to substances and environmental toxins.`;
        practicalAdvice = `Keep one foot rooted in reality while your head is in the clouds.`;
        break;
      case "Pluto":
        coreMeaning = "Power, transformation, and the subconscious.";
        personalityInfluence = `You undergo profound rebirths related to ${signName} themes.`;
        careerInfluence = `You are drawn to research, psychology, or positions of hidden power.`;
        loveInfluence = `Intense, all-or-nothing dynamics characterize your attachments.`;
        healthInfluence = `Repressed emotions manifest physically; prioritize deep therapy or shadow work.`;
        practicalAdvice = `Don't fear endings; they are making way for your next evolution.`;
        break;
      case "Rahu":
        coreMeaning = "Worldly obsession, ambition, and innovation.";
        personalityInfluence = `You are deeply hungry to master ${signName} traits in this lifetime.`;
        careerInfluence = `Unconventional paths or foreign connections bring massive gains.`;
        loveInfluence = `You may attract unusual partners or experience sudden shifts.`;
        healthInfluence = `Anxiety and overstimulation require conscious detoxing.`;
        practicalAdvice = `Pursue your ambitions, but remember that true satisfaction comes from within.`;
        break;
      case "Ketu":
        coreMeaning = "Spiritual detachment, past-life mastery, and intuition.";
        personalityInfluence = `You have an innate, effortless mastery over ${signName} qualities.`;
        careerInfluence = `You feel detached from material success, seeking deeper meaning.`;
        loveInfluence = `Karmic connections are common; learn when to let go.`;
        healthInfluence = `Mysterious ailments may arise; energy healing is highly effective.`;
        practicalAdvice = `Use your innate gifts without clinging to the results.`;
        break;
      default:
        coreMeaning = "A unique astrological placement.";
        personalityInfluence = `Expressed through ${signName}.`;
    }

    return {
      coreMeaning,
      personalityInfluence,
      careerInfluence,
      loveInfluence,
      healthInfluence,
      practicalAdvice,
      strength: calculateStrength(planet)
    };
  }
