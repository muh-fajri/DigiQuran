/* Scroll to Top */
$(window).scroll(function() {
    if($(this).scrollTop() > 250)
        $('#toTop').fadeIn();
    else
        $('#toTop').fadeOut();
});
// Click event
$('#toTop').click(function() {
    $('html, body').animate({scrollTop: 0});
    return false;
});
/*-- Scroll to Top --*/

/* Button Open and Close Search */
$('#open-search').click(function(e) {
    e.preventDefault();
    $('.search-menu').fadeIn().css('display','flex');
});

$('#close-search').click(function() {
    $('.search-menu').fadeOut();
});
/*-- Button Open and Close Search --*/

/* Web API Request Method :
 * - HTTP Request
 * - AJAX   -> $.ajax()
 * - jQuery -> $getJSON()
 */

/* Request Web API */
$.ajax({
    url: 'https://api.quran.gading.dev/surah',
    type: 'get',
    dataType: 'json',
    data: '',
    success: (data) => {
        let surah = data.data;
        $.each(surah, (i, data) => {
            $('#surah-list').append(`
                <div class="card">
                    <h2 class="surah-name" data-id="${data.number}">${data.name.long}</h2>
                    <h3 class="latin-name">${data.name.transliteration.en} (${data.number})</h3>
                    <p class="surah-attribute"><span class="ayah-count">${data.numberOfVerses} ayat</span></p>
                    <p class="surah-translation">${data.name.translation.en}</p>
                </div>
            `);
        });
    }
});

$('#surah-list').on('click', '.surah-name', function() {
    let number = $(this).data("id");
    
    // 1. Tambahkan state ke history browser
    // Parameter: {data}, judul, URL (menggunakan hash #surah-nomor)
    history.pushState({view: 'detail'}, '', '#surah-' + number);

    // 2. Sembunyikan daftar, tampilkan konten
    $('#surah-list').hide();
    $('#surah-content').show().html('<p style="text-align:center; margin-top:50px;">Memuat ayat...</p>');
    
    // 3. Panggil fungsi untuk ambil data surah
    loadSurah(number);
});

function loadSurah(number) {
    $.ajax({
        url: `https://api.quran.gading.dev/surah/${number}`,
        type: 'get',
        dataType: 'json',
        data: '',
        success: (data) => {
            // LANGKAH PENTING: Kosongkan elemen untuk menghapus tulisan "Memuat ayat..."
            $('#surah-content').html('');
            
            let surah = data.data;
            if((`${surah.number}` == '1') || (`${surah.number}` == '9')) {
                $('#surah-content').append(`
                    <div class="title" style="text-align:center">
                        <h2>${surah.name.long}</h2>
                        <p>
                            <span>${surah.name.transliteration.en}</span>
                            <span>(${surah.name.translation.en})</span>
                        </p>
                        <p>
                            <span>${surah.revelation.en} - </span>
                            <span dir="rtl" class="revelation">${surah.revelation.arab}</span>
                        </p>
                        <p style="font-size:14px;font-weight:bold">
                            <span>Surah ${surah.number}</span>
                            :
                            <span>${surah.numberOfVerses} ayat</span>
                        </p>
                    </div>
                `);
            } else {
                $('#surah-content').append(`
                    <div class="title" style="text-align:center">
                        <h2>${surah.name.long}</h2>
                        <p>
                            <span>${surah.name.transliteration.en}</span>
                            <span>(${surah.name.translation.en})</span>
                        </p>
                        <p>
                            <span>${surah.revelation.en} - </span>
                            <span dir="rtl" class="revelation">${surah.revelation.arab}</span>
                        </p>
                        <p style="font-size:14px;font-weight:bold">
                            <span>Surah ${surah.number}</span>
                            :
                            <span>${surah.numberOfVerses} ayat</span>
                        </p>
                        <div class="preBismillah">
                            <p class="bismillah">${surah.preBismillah.text.arab}</p>
                        </div>
                    </div>
                `);
            }
            console.log(data);
            let verses = data.data.verses;
            let currentIndex = 0;
            let itemPerLoad = 15; // Jumlah ayat yang dimuat setiap kali

            // Fungsi untuk merender potongan ayat
            function renderVerses() {
                let nextVerses = verses.slice(currentIndex, currentIndex + itemPerLoad);

                $.each(nextVerses, (i, data) => {
                    $('#surah-content').append(`
                        <div class="detail">
                            <p class="meta">
                                <span>${surah.number} : ${data.number.inSurah}</span>
                                <a class="audio-play" title="Putar Audio">
                                    <span class="fas fa-play"></span>
                                </a>
                                <audio class="ayah-audio">
                                    <source src="${data.audio.secondary[1]}">
                                </audio>
                            </p>
                            <p class="arab" dir="rtl">${data.text.arab}</p>
                            <p class="trs">${data.text.transliteration.en}</p>
                            <p class="idn">${data.translation.en}</p>

                            <div class="tafsir-text" style="display:none; padding: 15px; border-left: 3px solid #2793ae; background: #f9f9f9; margin-top: 10px; font-style: italic;">
                                <strong>Tafsir:</strong> <br>
                                ${data.tafsir.id.short}
                            </div>
                        </div>
                    `);
                });

                currentIndex += itemPerLoad;

                // Hapus tombol lama jika ada, lalu cek apakah perlu tombol "Muat Lebih Banyak"
                $('#load-more-container').remove();

                if (currentIndex < verses.length) {
                    $('#surah-content').append(`
                        <div id="load-more-container" style="text-align:center; padding: 20px;">
                            <button id="btn-load-more" style="padding: 10px 20px; background:#2793ae; color: white; border: none; border-radius: 5px; cursor: pointer; min-width: 180px;">
                                <span id="load-text">Muat Ayat Selanjutnya...</span>
                            </button>
                        </div>
                    `);
                }

                // Event klik untuk tombol Load More dengan Spinner
                $('#surah-content').off('click', '#btn-load-more').on('click', '#btn-load-more', function() {
                    let btn = $(this);
                    
                    // 1. Ubah tombol menjadi mode loading
                    btn.prop('disabled', true); // Cegah klik ganda
                    btn.html(`<span class="fas fa-spinner fa-spin"></span> Memuat...`);
                    btn.css('opacity', '0.8');

                    // 2. Gunakan setTimeout kecil untuk memberi waktu browser merender spinner 
                    // sebelum melakukan proses looping yang berat
                    setTimeout(function() {
                        renderVerses();
                        
                        // Scroll otomatis sedikit ke bawah agar ayat baru terlihat
                        $('html, body').animate({
                            scrollTop: $(window).scrollTop() + 200
                        }, 500);
                    }, 300); 
                });
            }

            // Panggil pertama kali untuk memuat 15 ayat awal
            renderVerses();

            // Event klik untuk tombol Load More
            $('#surah-content').on('click', '#btn-load-more', function() {
                renderVerses();
            });
        }
    });
}

// Mendeteksi ketika tombol Back di smartphone/browser ditekan
$(window).on('popstate', function() {
    // Jika URL kembali ke asal (tanpa hash #surah-xx)
    if (!window.location.hash) {
        $('#surah-content').hide().html(''); // Sembunyikan & kosongkan detail
        $('#surah-list').fadeIn();           // Tampilkan kembali daftar surah
        $(window).scrollTop(0);              // Reset scroll ke atas
    }
});
/*-- Request Web API --*/

/* Live Search dengan Highlight */
$(document).ready(function() {
    $('#search-box').on('keyup', function() {
        let value = $(this).val().toLowerCase();
        
        // Targetkan elemen yang ingin dicari (card untuk daftar surah, detail untuk ayat)
        let targets = $('.card, .detail');

        targets.each(function() {
            let container = $(this);
            let text = container.text().toLowerCase();

            // 1. Bersihkan highlight sebelumnya (menghapus tag mark)
            removeHighlight(container);

            if (value.length > 0) {
                if (text.indexOf(value) > -1) {
                    container.show();
                    // 2. Terapkan highlight baru
                    applyHighlight(container, value);
                } else {
                    container.hide();
                }
            } else {
                container.show();
            }
        });
    });

    // Fungsi untuk membungkus teks yang cocok dengan tag <mark>
    function applyHighlight(element, term) {
        // Cari elemen spesifik yang berisi teks (agar tidak merusak tag HTML/atribut)
        element.find('h2, h3, p.trs, p.idn, p.surah-translation, p.latin-name').each(function() {
            let innerHTML = $(this).html();
            let regex = new RegExp(`(${term})`, "gi"); // 'gi' untuk case-insensitive
            innerHTML = innerHTML.replace(regex, `<mark class="highlight">$1</mark>`);
            $(this).html(innerHTML);
        });
    }

    // Fungsi untuk menghapus highlight (mengembalikan teks asli)
    function removeHighlight(element) {
        element.find('mark.highlight').each(function() {
            $(this).replaceWith($(this).text());
        });
    }
});
/*-- Live Search dengan Highlight --*/

$('#surah-list').on('click', '.surah-name', function() {
    let number = $(this).data("id");
    
    // Tambahkan history state
    history.pushState({view: 'detail'}, '', '#surah-' + number);

    // Sembunyikan daftar surah
    $('#surah-list').hide();
    
    // Tampilkan Loading Spinner di dalam #surah-content
    $('#surah-content').show().html(`
        <div class="loading-state">
            <span class="fas fa-spinner"></span>
            <p>Memuat Ayat...</p>
        </div>
    `);
    
    // Ambil data dari API
    loadSurah(number);
});

/* Event Click untuk Audio (Ubah Ikon Play/Pause) */
$('#surah-content').on('click', '.audio-play', function() {
    const audio = $(this).siblings('.ayah-audio')[0];
    const icon = $(this).find('.fas');

    if (audio.paused) {
        // Reset semua audio lain & semua ikon play lainnya
        $('.ayah-audio').each(function() {
            this.pause();
        });
        $('.audio-play .fas').removeClass('fa-pause').addClass('fa-play');

        // Putar audio ini
        audio.play();
        icon.removeClass('fa-play').addClass('fa-pause');
    } else {
        // Pause audio ini
        audio.pause();
        icon.removeClass('fa-pause').addClass('fa-play');
    }

    // Reset ikon jika audio habis
    audio.onended = function() {
        icon.removeClass('fa-pause').addClass('fa-play');
    };
});