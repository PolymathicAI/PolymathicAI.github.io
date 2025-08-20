---
layout: post
title: "Lost in Latent Space: the Pros and Cons of Latent Physics Emulation"
authors: François Rozet, Ruben Ohana, Michael McCabe, Gilles Louppe, François Lanusse, Shirley Ho
shorttitle: "Lost in Latent Space"
date: 2025-07-21 9:00
smallimage: latent_space_s.jpg
image: latent_space.jpg
blurb: We show that latent diffusion models are robust to compression in the context of physics emulation, reducing computational cost while consistently outperforming non-generative alternatives.
shortblurb: We show that latent diffusion models are robust to compression in the context of physics emulation, reducing computational cost while consistently outperforming non-generative alternatives.
splashimage: /images/blog/latent_space.jpg
link: https://arxiv.org/abs/2507.02608
github_link: https://github.com/PolymathicAI/lola
permalink: /blog/lostinlatentspace/
---

Numerical simulations are fundamental to scientific progress, enabling everything from weather forecasting to plasma control in fusion reactors. However, achieving high-fidelity results often requires significant computational resources, making these simulations a bottleneck for rapid research and development.

At <a href="https://polymathic-ai.org/">Polymathic</a>, we believe that neural network-based emulators are a promising alternative to traditional numerical solvers, enabling orders of magnitude faster simulations. Recently, latent diffusion models were applied with success to the problem of emulating dynamical systems (<a href="https://arxiv.org/abs/2307.10422">Gao et al., 2023</a>; <a href="https://arxiv.org/abs/2403.05940">Du et al., 2024</a>; <a href="https://arxiv.org/abs/2504.18720">Andry et al., 2025</a>), sometimes even outperforming pixel-space emulation. In this work, we asked ourselves a simple question: *What is the impact of latent-space compression on emulation accuracy?*

The answer surprised us, and we think it will surprise you too.

#### From Pixel Space to Latent Space

The core idea of latent diffusion models (<a href="https://arxiv.org/abs/2112.10752">Rombach et al., 2022</a>), which have proven highly effective for image and video generation, is to perform the generative process not in the high-dimensional pixel space, but in a compressed, low-dimensional latent space learned by an autoencoder. For natural images, compression serves a dual purpose: reducing computational cost and filtering out perceptually irrelevant patterns that might distract the generative model from semantically meaningful information.

In our case, the methodology involves three stages. First, an autoencoder is trained to compress high-dimensional physical states into compact latent representations. Second, a diffusion model is trained to predict/emulate the temporal evolution of the system within this compressed latent space. Third, after training, the diffusion model is used to predict the sequence of latent states which are then mapped back to the pixel space with the autoencoder's decoder.

<p align="center">
  <img src="/images/blog/latent_emulation.svg" alt="Latent emulation" width="95%" style="mix-blend-mode: darken;">
</p>

#### Findings

To answer our research question, we trained and evaluated latent-space emulators across a wide range of compression rates – from modest (x48) to extreme (x1280) – on three challenging datasets from <a href="https://polymathic-ai.org/blog/thewell">The Well</a>:

- **Euler Multi-Quadrants**, describing compressible fluids and shock waves.
<p align="center">
<video width="95%" controls>
  <source src="/images/blog/latent_space_vid/euler_f32c64.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
</p>

- **Rayleigh-Bénard**, modeling buoyancy driven convection currents.
<p align="center">
<video width="95%" controls>
  <source src="/images/blog/latent_space_vid/rb_f32c64.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
</p>

- **Turbulence Gravity Cooling**, simulating the formation and radiative cooling of stars in interstellar media.
<p align="center">
<video width="95%" controls>
  <source src="/images/blog/latent_space_vid/tgc_f32c64.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
</p>

Our experiments reveal two key findings.

**1. Robustness to Compression**

Our most striking finding is the **remarkable resilience of latent emulation to the compression rate** of the latent space with respect to pixel space. While reconstruction quality deteriorates as compression increases, we do not observe any significant degradation in the emulation accuracy itself. In all cases, **latent emulators outperform pixel-space baselines**, despite using fewer parameters and less training compute.

Nevertheless, our evaluation reveals potential overfitting issues at extreme compression rates. This makes intuitive sense: as compression increases, the effective size of the dataset in latent space decreases, making overfitting more likely at fixed model capacity. This underscores the importance of efforts like <a href="https://polymathic-ai.org/blog/thewell">The Well</a>, which provides curated, large-scale physics data for training and benchmarking emulators.

**2. Generative Models over Deterministic Solvers**

Across all tasks and compression rates, **diffusion-based emulators are consistently more accurate than deterministic neural solvers**. They not only produce better and more plausible trajectories, but also capture the uncertainty and diversity inherent to turbulent and chaotic dynamical systems.

#### Practical Recommendations for Practitioners

Our findings translate into clear, actionable recommendations for practitioners developing physics emulators. First, **try latent-space approaches**. They offer reduced computational requirements and provide comparable or superior performances across a wide range of compression rates. In our case, it also greatly simplified the development and training of the emulator as we could rely on widespread transformer architectures with well known scaling properties. Second, **prefer generative over deterministic emulators**. They yield better accuracy, more plausible dynamics, stable rollouts, and naturally handle uncertainty.

For more details, check out the <a href="https://arxiv.org/abs/2507.02608">paper</a>.

---
Image by [JJ Ying](https://unsplash.com/@jjying?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) via [Unsplash](https://unsplash.com/photos/white-cloth-lot-WmnsGyaFnCQ?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash).